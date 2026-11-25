/** Fixed disjoint invented groups only. No caller filters, scores, identifiers or real cohort data. */
const GROUPS=Object.freeze([
 Object.freeze({key:'fictional-a',visits:8,explored:5,skipped:3}),
 Object.freeze({key:'fictional-b',visits:4,explored:3,skipped:1}),
 Object.freeze({key:'fictional-c',visits:10,explored:8,skipped:2}),
 Object.freeze({key:'fictional-d',visits:12,explored:6,skipped:6})
]);
const MIN=5;
export function syntheticAggregateReport(){
 // Suppress an entire row if any nonzero or zero component is below threshold.
 // No totals, overlap, filter, export or alternate view that could reveal suppressed counts.
 const groups=GROUPS.map(g=>[g.visits,g.explored,g.skipped].every(x=>x>=MIN)?
 {key:g.key,status:'SYNTHETIC_VISIBLE',visits:g.visits,explored:g.explored,skipped:g.skipped}:
 {key:g.key,status:'SUPPRESSED',visits:null,explored:null,skipped:null});
 return {schema:'aifs-m119-aggregate-v1',minimumCount:MIN,groups,syntheticOnly:true,realAnalyticsEnabled:false,storesStudentData:false,publicReleaseApproved:false};
}
