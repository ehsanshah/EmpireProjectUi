import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',use:{channel:'chrome',baseURL:'http://127.0.0.1:5180',viewport:{width:1440,height:900}},reporter:'list'});
