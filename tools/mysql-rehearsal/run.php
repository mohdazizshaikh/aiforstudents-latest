<?php
declare(strict_types=1);
require __DIR__.'/repository.php';
function check(bool $ok,string $name):void {if(!$ok)throw new RuntimeException('Check failed: '.$name);}
function rejects(callable $f,string $name):void {try{$f();}catch(InvalidArgumentException|RuntimeException|PDOException $e){return;}throw new RuntimeException('Expected denial: '.$name);}
try {
    if($argc!==1)throw new RuntimeException('No command arguments permitted');
    $raw=stream_get_contents(STDIN,524289);
    if($raw===false||strlen($raw)>524288)throw new RuntimeException('Invalid fixture size');
    $fixture=json_decode($raw,true,64,JSON_THROW_ON_ERROR);
    $r=new RehearsalRepository();
    $r->initialize();check($r->version()===1,'version 1');
    rejects(fn()=>$r->initialize(),'nonempty schema');
    $r->seed($fixture);$count=count($fixture['activity']);
    foreach(['en','hi'] as $lang){
        $catalog=$r->catalog($lang);
        $expected=array_map(fn($x)=>['key'=>$x['key'],'subject'=>$x['subject'],'kind'=>$x['kind'],'title'=>$x['title_'.$lang]],$fixture['activity']);
        check($catalog===$expected,'exact bilingual source parity');
        foreach(['maths','physics','chemistry','biology'] as $subject)foreach(['all','basic','advanced','supplement','prototype'] as $kind){
            $wanted=array_values(array_filter($expected,fn($x)=>$x['subject']===$subject&&($kind==='all'||$x['kind']===$kind)));
            check($r->catalog($lang,$subject,$kind)===$wanted,'filtered parity');
        }
    }
    foreach($fixture['cells'] as $x)check($r->curriculum($x['board'],$x['grade'],$x['subject'])===['proposals'=>$x['proposals'],'checks'=>$x['checks'],'mapping_ids'=>json_decode($x['mapping_ids'],true,32,JSON_THROW_ON_ERROR),'verifiedChapters'=>0],'curriculum parity');
    check($r->getPlan()===['language'=>'en','keys'=>[]],'empty plan');
    $keys=array_column(array_slice($fixture['activity'],0,6),'key');
    $plan=['language'=>'hi','keys'=>array_reverse($keys)];
    check($r->setPlan($plan)===$plan,'ordered six-key plan');
    $snapshot=$r->logicalSnapshot();
    foreach([['language'=>'en','keys'=>[$keys[0],$keys[0]]],['language'=>'en','keys'=>['unknown:main']],['language'=>'en','keys'=>array_column(array_slice($fixture['activity'],0,7),'key')],['language'=>'invalid','keys'=>[]],['language'=>'en','keys'=>[],'student'=>'forbidden']] as $bad){
        rejects(fn()=>$r->setPlan($bad),'invalid plan');check($r->getPlan()===$plan,'invalid plan unchanged');
    }
    rejects(fn()=>$r->setPlan(['language'=>'en','keys'=>[]],true),'injected DML failure');
    check($r->getPlan()===$plan,'transaction rollback');
    rejects(fn()=>$r->migrateV2(true),'interrupted migration');check($r->version()===1,'unadvanced version after DDL');
    $r->migrateV2();check($r->version()===2,'resumed migration');
    check($r->getPlan()===$plan&&count($r->catalog('hi'))===$count,'migration preserves data');
    rejects(fn()=>$r->migrateV2(),'already migrated');
    $r->setPlan(['language'=>'en','keys'=>[]]);$bad=$snapshot;$bad['sha256']=str_repeat('0',64);
    rejects(fn()=>$r->restorePlan($bad),'tampered snapshot');check($r->getPlan()===['language'=>'en','keys'=>[]],'bad snapshot unchanged');
    check($r->restorePlan($snapshot)===$plan,'logical restore');
    rejects(fn()=>$r->catalog('en',"maths' OR '1'='1"),'invalid filter');
    rejects(fn()=>$r->curriculum('CBSE',13,'maths'),'invalid grade');
    echo json_encode(['valid'=>true,'activityRows'=>$count,'languageVariants'=>$count*2,'curriculumCells'=>96,'filterChecks'=>40,'migrationVersion'=>2,'interruptedMigrationResumed'=>true,'dmlRollbackVerified'=>true,'logicalPlanRestoreVerified'=>true,'actualMySQLRehearsal'=>true,'liveHostingVerified'=>false,'publicReleaseApproved'=>false,'storesStudentData'=>false],JSON_THROW_ON_ERROR|JSON_PRETTY_PRINT).PHP_EOL;
} catch(Throwable $e) {fwrite(STDERR,'M125 fixture rehearsal failed: '.get_class($e).': '.$e->getMessage().PHP_EOL);exit(1);}
