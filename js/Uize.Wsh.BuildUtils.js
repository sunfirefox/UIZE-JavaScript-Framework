/*
	UIZE JAVASCRIPT FRAMEWORK 2011-11-19

	http://www.uize.com/reference/Uize.Wsh.BuildUtils.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Wsh.BuildUtils',required:['Uize.Url','Uize.Template','Uize.Data.Simple','Uize.String','Uize.String.Lines','Uize.Json','Uize.Array.Sort','Uize.Test'],builder:function(){var _a=function(){};var _b={};function _c(_d){return _d}function _e(_f){return Uize.Url.from(_f).fileName;}function _g(_h,_i,_j){(_i=new RegExp(_i.source,'g'+(_i.multiline?'m':'')+(_i.ignoreCase?'i':''))).lastIndex=_j||0;return _i.exec(_h);}_a.getHtmlFilesInfo=function(_k,_l){var _m=[];if(!_l)_l=_c;for(var _n= -1,_o=Uize.Wsh.getFiles(_k),_p=_o.length;++_n<_p;){var _f=_o[_n],_q=Uize.Url.from(_f).file;if(/\.html$/i.test(_q)&&_q.charAt(0)!='~'){var _r=Uize.Wsh.readFile(_f),_s=_r.match(/<meta name="keywords" content="(.*?)"\/>/),_t=_r.match(/<meta name="description" content="(.*?)"\/>/),_u=_r.match(/<link rel="image_src" href="(.*?)"\/>/);_m.push({path:_k+'/'+_q,title:_l(_r.match(/<title>(.*?)<\/title>/)[1]),keywords:_s?_s[1]:'',description:_t?_t[1]:'',imageSrc:_u?Uize.Url.toAbsolute(_k,_u[1]):''});}}
Uize.Array.Sort.sortBy(_m,'value.title.toLowerCase ()');return _m;};_a.readSimpleDataFile=function(_v){return Uize.Data.Simple.parse({simple:Uize.Wsh.readFile(_v),collapseChildren:true});};_a.compileJstFile=function(_w){var _x=_b[_w];if(!_x){if(!Uize.Wsh.fileExists(_w))return;_x=_b[_w]=Uize.Template.compile(Uize.Wsh.readFile(_w),{result:'full'});Uize.module({required:_x.required});}return _x.templateFunction;};_a.processJstFile=function(_w,_y){var _x=_a.compileJstFile(_w);_x&&Uize.Wsh.writeFile({path:_w.replace(/\.jst$/,''),text:_x(_y)});};_a.runScripts=function(_z){var _A;if(!Uize.isArray(_z))_z=[_z];for(var _B= -1,_C=_z.length,_D=new ActiveXObject('WScript.Shell'),_E;++_B<_C&& !_A;)if(_E=_D.Run('WScript '+_z[_B],0,true))_A={script:_z[_B],errorCode:_E};return _A;};_a.testAllModules=function(){var _F=/\.js$/i,_G=/\.library\.js$/i,_H=/^[a-zA-Z_\$][a-zA-Z0-9_\$]*\.Test($|\.)/,_I=Uize.Wsh.getFiles(env.moduleFolderPath,function(_f){return _F.test(_f)&& !_G.test(_f)},_e).sort(),_J=Uize.lookup(_I);var _K={},_L=[];
function _M(_N){if(!_K[_N]){_K[_N]=1;if(_N){var _O;try{Uize.moduleLoader(_N,function(_P){_O=_P});}catch(_A){}if(_O){var _Q=_N.substr(0,_N.lastIndexOf('.')),_R=new RegExp('Uize\\s*\\.\\s*module\\s*\\(\\s*\\{\\s*name\\s*:\\s*([\'"])'+Uize.escapeRegExpLiteral(_N)+'\\1'),_S=_g(_O,_R);_Q&&_M(_Q);if(_S){var _T=_S.index+_S[0].length,_U=/superclass\s*:\s*(['"])([^'"]*)\1/,_V=_g(_O,_U,_T),_W=/required\s*:\s*((['"])([^'"]*)\2|(\[[^\]]*\]))/,_X=_g(_O,_W,_T);_V&&_M(_V[2]);if(_X){if(_X[4]){var _Y=[];try{_Y=eval('('+_X[4]+')')}catch(_A){}Uize.forEach(_Y,_M);}else{_M(_X[3]);}}}_L.push(_N);}}}}Uize.forEach(_I,function(_N){_H.test(_N)||_M(_N);});var _Z,_0=Uize.Test.declare({title:'Unit Tests Suite',test:Uize.map(_L,function(_N){return(_J[_Z=_N.match(/([^\.]*)(\.|$)/)[1]+'.Test.'+_N]?Uize.Test.testModuleTest(_Z):Uize.Test.requiredModulesTest(_N));})});_a.runUnitTests(_0);};_a.runUnitTests=function(_1){if(typeof _1=='string'){Uize.module({required:_1,builder:function(){_a.runUnitTests(eval(_1))}});}else{var _2=new _1,_3=[];
_2.wire({Start:function(_4){_3.push(Uize.String.repeat('\t',_4.source.getDepth())+_4.source.get('title'));},Done:function(_4){var _5=_4.source,_6=_5.get('reasonForFailure');_3.push(Uize.String.repeat('\t',_5.getDepth()+1)+(_5.get('result')?('PASSED!!! (duration: '+_5.get('duration')+'ms)'):('*** FAILED *** '+(_6||''))));_6&&_3.push('','',_5.getSynopsis());if(_5==_2|| !_5.get('result')){(WScript.Arguments.Count()&&WScript.Arguments.Item(0)=='silent')||alert(_5.getSynopsis());Uize.Wsh.writeFile({path:WScript.ScriptName.replace(/\.js$/,'.log'),text:_3.join('\n')});_5.get('result')||WScript.Quit(1);}}});_2.run();}};_a.writeDataModule=function(_7,_N,_8){Uize.Wsh.writeFile({path:_7+'\\'+_N+'.js',text:'Uize.module ({\n'+'\tname:\''+_N+'\',\n'+'\tbuilder:function () {\n'+'\t\treturn function () {\n'+'\t\t\treturn '+Uize.String.Lines.indent(Uize.Json.to(_8),3,'\t',false)+';\n'+'\t\t};\n'+'\t}\n'+'});\n'});};return _a;}});