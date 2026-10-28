import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',testMatch:'phase14.spec.ts',use:{channel:'chrome',baseURL:'http://127.0.0.1:5182',viewport:{width:1440,height:900}},webServer:{command:'npm run dev -- --host 127.0.0.1 --port 5182',url:'http://127.0.0.1:5182',reuseExistingServer:true},reporter:'list'});
