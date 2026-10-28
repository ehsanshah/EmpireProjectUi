import {expect,it} from 'vitest';
import {createLiveCoreClient} from '../src/core/httpClient';

it('fails closed when the Live contract is not verified',()=>{
 expect(()=>createLiveCoreClient()).toThrow('Live contract is unverified. No Demo fallback is permitted.');
});
