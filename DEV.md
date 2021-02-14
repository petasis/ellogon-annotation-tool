Tutorial from: https://medium.com/js-dojo/how-to-build-a-file-manager-storage-web-app-with-django-rest-framework-and-vue-js-e89a83318e9c

1) cd /home/clarinel/ellogon-annotation-tool/

2) django-admin startproject ellogon_annotation_tool

3) cd ellogon_annotation_tool

4) npm install -g @vue/cli  ;# -g can be ommited
   npm install -g @vue/cli-init

5) vue init webpack-simple vue_app
? Project name vue_app
? Project description The Ellogon Annotation Web Platform
? Author Georgios Petasis <petasis@iit.demokritos.gr>
? License GPL v3.0
? Use sass? No

6) cd vue_app
   npm install
   npm run dev

7) npm install --save-dev webpack-bundle-tracker@0.4.3
   npm install --save-dev write-file-webpack-plugin

8) django-admin startapp filemanager


https://medium.com/js-dojo/part-2-how-to-build-a-file-manager-storage-web-app-with-django-rest-framework-and-vue-js-852e30e52aa5
