/* M19: non-inline print action, compatible with staging CSP. */
const printButton=document.querySelector('[data-print-worksheet]');
if(printButton)printButton.addEventListener('click',()=>window.print());