import {createProxy} from './account.mjs';
export default createProxy('dialogue-payments');
export const config={path:'/api/payments',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
