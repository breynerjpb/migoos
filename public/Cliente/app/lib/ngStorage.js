/*! ngStorage 0.3.0 | Copyright (c) 2013 Gias Kay Lee | MIT License */"use strict";
!function(){function a(a){return["$rootScope","$window",function(b,c){
	for(var d,e,f,g=c[a]||(console.warn("This browser does not support Web Storage!"),{}),
		h={$default:function(a){for(var b in a)angular.isDefined(h[b])||(h[b]=a[b]);return h},
		$reset:function(a){for(var b in h)"$"===b[0]||delete h[b];return h.$default(a)}},i=0;i<g.length;i++)
		(f=g.key(i))&&"ngStorage-"===f.slice(0,10)&&(h[f.slice(10)]=angular.fromJson(g.getItem(f)));
	return d=angular.copy(h),b.$watch(function(){e||(e=setTimeout(function(){
		if(e=null,!angular.equals(h,d)){angular.forEach(h,function(a,b){
			angular.isDefined(a)&&"$"!==b[0]&&g.setItem("ngStorage-"+b,angular.toJson(a)),
			delete d[b]});for(var a in d)g.removeItem("ngStorage-"+a);d=angular.copy(h)}},100))}),
	"localStorage"===a&&c.addEventListener&&c.addEventListener("storage",function(a){
		"ngStorage-"===a.key.slice(0,10)&&(a.newValue?h[a.key.slice(10)]=angular.fromJson(a.newValue):delete 
			h[a.key.slice(10)],d=angular.copy(h),b.$apply())}),h}]}angular.module("ngStorage",[]).factory("$localStorage",a("localStorage")).factory("$sessionStorage",a("sessionStorage"))}();