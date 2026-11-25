<?php
declare(strict_types=1);
/* M125 isolated CLI repository. No web route, real account, or production database. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
final class RehearsalRepository {
    private const SUBJECTS=['maths','physics','chemistry','biology'];
    private const KINDS=['basic','advanced','supplement','prototype'];
    private const LANGS=['en','hi'];
    private const BOARDS=['CBSE','Maharashtra'];
    private PDO $db;
    public function __construct() {
        if(getenv('AIFS_MYSQL_REHEARSAL')!=='1'||getenv('AIFS_MYSQL_FIXTURE_PASSWORD')!=='m125-ephemeral-fixture-only') throw new RuntimeException('Fixed isolated rehearsal required');
        $this->db=new PDO('mysql:host=127.0.0.1;port=3306;dbname=aifs_rehearsal_m125;charset=utf8mb4','aifs_fixture',getenv('AIFS_MYSQL_FIXTURE_PASSWORD'),[
            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_STRINGIFY_FETCHES=>false,PDO::MYSQL_ATTR_MULTI_STATEMENTS=>false
        ]);
        $this->db->exec("SET SESSION sql_mode='STRICT_ALL_TABLES,NO_ENGINE_SUBSTITUTION'");
    }
    private function run(string $sql,array $args=[]): PDOStatement {
        $s=$this->db->prepare($sql);$s->execute($args);return $s;
    }
    private function tx(callable $fn): mixed {
        $this->db->beginTransaction();
        try{$r=$fn();$this->db->commit();return $r;}
        catch(Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
    }
    private static function enum(string $x,array $allowed): void {if(!in_array($x,$allowed,true))throw new InvalidArgumentException('Invalid enum');}
    public function initialize(): void {
        // Refuse nonempty databases. MySQL DDL implicitly commits; no false atomic DDL claim.
        if((int)$this->run('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()')->fetchColumn()!==0)throw new RuntimeException('Fixture database is not empty');
        $sql=file_get_contents(__DIR__.'/schema-v1.sql');
        foreach(explode(';',$sql) as $stmt){if(trim($stmt)!=='')$this->db->exec($stmt);}
    }
    public function version(): int {return (int)$this->run('SELECT version_number FROM aifs_version WHERE singleton=1')->fetchColumn();}
    public function migrateV2(bool $interruptAfterDdl=false): void {
        if($this->version()!==1)throw new RuntimeException('Unexpected schema version');
        $columns=$this->run("SELECT COLUMN_DEFAULT,IS_NULLABLE,CHARACTER_MAXIMUM_LENGTH FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='aifs_activity' AND column_name='review_state'")->fetchAll();
        if(count($columns)===0)$this->db->exec(trim(file_get_contents(__DIR__.'/schema-v2.sql')));
        // Retry after an interrupted DDL is allowed only when exact expected column and fixed default exist.
        $col=$this->run("SELECT COLUMN_DEFAULT,IS_NULLABLE,CHARACTER_MAXIMUM_LENGTH FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='aifs_activity' AND column_name='review_state'")->fetch();
        if(!$col||$col['COLUMN_DEFAULT']!=='PENDING'||$col['IS_NULLABLE']!=='NO'||(int)$col['CHARACTER_MAXIMUM_LENGTH']!==7)throw new RuntimeException('Unexpected migration shape');
        if($interruptAfterDdl)throw new RuntimeException('Synthetic interrupted migration');
        $this->tx(function(){
            if((int)$this->run("SELECT COUNT(*) FROM aifs_activity WHERE review_state<>'PENDING'")->fetchColumn()!==0)throw new RuntimeException('Unexpected approval');
            if($this->run('UPDATE aifs_version SET version_number=2 WHERE singleton=1 AND version_number=1')->rowCount()!==1)throw new RuntimeException('Version changed');
        });
    }
    public function seed(array $fixture): void {
        if(array_keys($fixture)!==['activity','cells','publicReleaseApproved','storesStudentData']||$fixture['publicReleaseApproved']!==false||$fixture['storesStudentData']!==false||!is_array($fixture['activity'])||count($fixture['activity'])<109||count($fixture['activity'])>200||!is_array($fixture['cells'])||count($fixture['cells'])!==96)throw new InvalidArgumentException('Invalid fixture');
        $this->tx(function()use($fixture){
            if((int)$this->run('SELECT COUNT(*) FROM aifs_activity')->fetchColumn()!==0||(int)$this->run('SELECT COUNT(*) FROM aifs_curriculum')->fetchColumn()!==0)throw new RuntimeException('Refuse overwrite');
            foreach($fixture['activity'] as $x){
                if(array_keys($x)!==['key','subject','kind','title_en','title_hi']||!is_string($x['key'])||!preg_match('~^[a-z0-9/-]+:[a-z0-9-]+$~D',$x['key'])||!is_string($x['title_en'])||!is_string($x['title_hi'])||strlen($x['title_en'])>1200||strlen($x['title_hi'])>1200)throw new InvalidArgumentException('Invalid activity');
                self::enum($x['subject'],self::SUBJECTS);self::enum($x['kind'],self::KINDS);
                $this->run('INSERT INTO aifs_activity(activity_key,subject,kind,title_en,title_hi) VALUES(?,?,?,?,?)',array_values($x));
            }
            foreach($fixture['cells'] as $x){
                if(array_keys($x)!==['board','grade','subject','proposals','checks','mapping_ids']||!is_int($x['grade'])||$x['grade']<1||$x['grade']>12||!is_int($x['proposals'])||$x['proposals']<0||!is_int($x['checks'])||$x['checks']<0||!is_string($x['mapping_ids'])||!is_array(json_decode($x['mapping_ids'],true,32,JSON_THROW_ON_ERROR)))throw new InvalidArgumentException('Invalid planning cell');
                self::enum($x['board'],self::BOARDS);self::enum($x['subject'],self::SUBJECTS);
                $this->run('INSERT INTO aifs_curriculum(board,grade,subject,proposals,pending_checks,mapping_ids) VALUES(?,?,?,?,?,?)',array_values($x));
            }
        });
    }
    public function catalog(string $lang='en',string $subject='all',string $kind='all'): array {
        self::enum($lang,self::LANGS);self::enum($subject,['all',...self::SUBJECTS]);self::enum($kind,['all',...self::KINDS]);
        $title=$lang==='hi'?'title_hi':'title_en';
        return $this->run("SELECT activity_key AS `key`,subject,kind,$title AS title FROM aifs_activity WHERE (?='all' OR subject=?) AND (?='all' OR kind=?) ORDER BY activity_key",[$subject,$subject,$kind,$kind])->fetchAll();
    }
    public function curriculum(string $board,int $grade,string $subject): array {
        self::enum($board,self::BOARDS);self::enum($subject,self::SUBJECTS);if($grade<1||$grade>12)throw new InvalidArgumentException('Invalid grade');
        $r=$this->run('SELECT proposals,pending_checks,mapping_ids FROM aifs_curriculum WHERE board=? AND grade=? AND subject=?',[$board,$grade,$subject])->fetch();
        if(!$r)throw new RuntimeException('Missing planning cell');
        return ['proposals'=>(int)$r['proposals'],'checks'=>(int)$r['pending_checks'],'mapping_ids'=>json_decode($r['mapping_ids'],true,32,JSON_THROW_ON_ERROR),'verifiedChapters'=>0];
    }
    public function getPlan(): array {
        return ['language'=>$this->run('SELECT language FROM aifs_plan WHERE singleton=1')->fetchColumn(),'keys'=>$this->run('SELECT activity_key FROM aifs_plan_item ORDER BY position')->fetchAll(PDO::FETCH_COLUMN)];
    }
    public function setPlan(array $plan,bool $injectFailure=false): array {
        if(count($plan)!==2||!array_key_exists('language',$plan)||!array_key_exists('keys',$plan)||!is_string($plan['language'])||!is_array($plan['keys'])||!array_is_list($plan['keys'])||count($plan['keys'])>6)throw new InvalidArgumentException('Invalid plan');
        self::enum($plan['language'],self::LANGS);
        foreach($plan['keys'] as $k)if(!is_string($k)||!preg_match('~^[a-z0-9/-]+:[a-z0-9-]+$~D',$k))throw new InvalidArgumentException('Invalid key');
        if(count(array_unique($plan['keys']))!==count($plan['keys']))throw new InvalidArgumentException('Duplicate keys');
        return $this->tx(function()use($plan,$injectFailure){
            $this->run('SELECT singleton FROM aifs_plan WHERE singleton=1 FOR UPDATE')->fetch();
            foreach($plan['keys'] as $k)if(!$this->run('SELECT activity_key FROM aifs_activity WHERE activity_key=?',[$k])->fetch())throw new InvalidArgumentException('Unknown activity');
            $this->run('UPDATE aifs_plan SET language=? WHERE singleton=1',[$plan['language']]);
            $this->db->exec('DELETE FROM aifs_plan_item');
            if($injectFailure)throw new RuntimeException('Synthetic transaction failure');
            foreach($plan['keys'] as $i=>$key)$this->run('INSERT INTO aifs_plan_item VALUES(?,?)',[$i+1,$key]);
            return $this->getPlan();
        });
    }
    public function logicalSnapshot(): array {
        $payload=$this->getPlan();
        return ['schema'=>'m125-fixed-plan-snapshot-v1','payload'=>$payload,'sha256'=>hash('sha256',json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE))];
    }
    public function restorePlan(array $snapshot): array {
        if(array_keys($snapshot)!==['schema','payload','sha256']||$snapshot['schema']!=='m125-fixed-plan-snapshot-v1'||!is_array($snapshot['payload'])||!is_string($snapshot['sha256'])||!hash_equals(hash('sha256',json_encode($snapshot['payload'],JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)),$snapshot['sha256']))throw new InvalidArgumentException('Invalid snapshot');
        return $this->setPlan($snapshot['payload']);
    }
}
