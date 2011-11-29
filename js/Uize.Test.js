/*
	UIZE JAVASCRIPT FRAMEWORK 2011-11-18

	http://www.uize.com/reference/Uize.Test.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test',required:['Uize.Data','Uize.Json','Uize.Util.Oop'],builder:function(b_a){var b_b=true,b_c=false,b_d;var b_e=typeof navigator=='object',b_f='\n----------------------------------------------------------\n\n';var b_g=b_a.subclass(),b_h=b_g.prototype;function b_i(b_j){return function(){return Uize.Json.to(b_j)};}b_h.b_k=function(b_l,b_m,b_n){b_l||this.set({b_o:'EXPECTED:\n\n'+(Uize.isFunction(b_m)?b_m():b_m)+'\n\n'+'ACTUAL:\n\n'+b_n()});return b_l;};b_h.expect=function(b_p,b_j){return this.b_k(Uize.Data.identical(b_p,b_j),b_i(b_p),b_i(b_j));};b_h.expectSameAs=function(b_p,b_j){return this.b_k(b_p===b_j,b_i(b_p),b_i(b_j));};b_h.expectNonNull=function(b_j){return this.b_k(b_j!=null,'value that is not null or undefined',b_i(b_j));};b_h.expectInstanceOf=function(b_g,b_j){return this.b_k(b_j!=b_d&&b_j.constructor==(typeof b_g=='string'?eval(b_g):b_g),function(){return'instance of '+Uize.Util.Oop.getClassName(b_g)},
function(){return'instance of '+Uize.Util.Oop.getClassName(b_j.constructor)});};b_h.expectType=function(b_q,b_j){return this.b_k(typeof b_j==b_q,function(){return'type '+b_q},function(){return'type '+typeof b_j});};b_h.expectArray=function(b_j){return this.expectInstanceOf(Array,b_j);};b_h.expectBoolean=function(b_j){return this.expectType('boolean',b_j);};b_h.expectFunction=function(b_j){return this.expectType('function',b_j);};b_h.expectNumber=function(b_j){return this.expectType('number',b_j);};b_h.expectObject=function(b_j){return this.expectType('object',b_j);};b_h.expectRegExp=function(b_j){return this.expectInstanceOf(RegExp,b_j);};b_h.expectString=function(b_j){return this.expectType('string',b_j);};b_h.expectArrayLike=function(b_j){return(this.expectObject(b_j)&&this.expectNonNull(b_j)&&this.expectLengthInRange(0,Infinity,b_j.length));};b_h.expectInRange=function(b_r,b_s,b_j){return this.b_k(Uize.constrain(b_j,b_r,b_s)===b_j,function(){return'value within range '+b_r+' to '+b_s},b_i(b_j));};
b_h.expectNumberInRange=function(b_r,b_s,b_j){return this.expectNumber(b_j)&&this.expectInRange(b_r,b_s,b_j);};b_h.expectNegativeNumber=function(b_j){return this.expectNumberInRange(-Infinity,0,b_j);};b_h.expectPositiveNumber=function(b_j){return this.expectNumberInRange(0,Infinity,b_j);};b_h.expectLengthInRange=function(b_t,b_u,b_j){var b_v=b_j.length;return this.b_k(Uize.constrain(b_v,b_t,b_u)===b_v,function(){return'length within range '+b_t+' to '+b_u},function(){return b_v});};b_h.expectNonEmpty=function(b_j){return this.b_k(!Uize.isEmpty(b_j),'non-empty',b_i(b_j));};b_h.expectInteger=function(b_j){return(this.expectNumber(b_j)&&this.b_k(Math.floor(b_j)==b_j,'integer',b_i(b_j)));};b_h.expectIntegerInRange=function(b_r,b_s,b_j){return this.expectInteger(b_j)&&this.expectInRange(b_r,b_s,b_j);};b_h.expectNegativeInteger=function(b_j){return this.expectInteger(b_j)&&this.expectNegative(b_j);};b_h.expectPositiveInteger=function(b_j){return this.expectInteger(b_j)&&this.expectPositive(b_j);};
b_h.expectNoRepeats=function(b_j){return this.b_k(Uize.totalKeys(Uize.lookup(b_j))==b_j.length,'array with no repeated values',b_i(b_j));};b_h.expectNonEmptyArray=function(b_j){return this.expectArray(b_j)&&this.expectNonEmpty(b_j);};b_h.expectNonEmptyObject=function(b_j){return this.expectObject(b_j)&&this.expectNonEmpty(b_j);};b_h.expectNonEmptyString=function(b_j){return this.expectString(b_j)&&this.expectNonEmpty(b_j);};b_h.getDepth=function(){var b_w=0,b_x=this;while(b_x=b_x.parent)b_w++;return b_w;};b_h.getTotalTests=function(){var b_y=0;function b_z(b_A){b_y++;if(Uize.isArray(b_A)){for(var b_B= -1,b_C=b_A.length;++b_B<b_C;)b_z(b_A[b_B].b_D);}}b_z(this.b_D);return b_y;};b_h.getSynopsis=function(){var b_E=this,b_F=b_E.b_F,b_G=(b_F?'PASSED':'FAILED')+'\n',b_o=b_E.b_o;var b_H=b_E,b_I=[],b_J='',b_K='';while(b_H){b_I.push(b_H.b_L);b_H=b_H.parent;}for(var b_M=b_I.length;--b_M> -1;){b_J+=b_K+b_I[b_M]+'\n';b_K+='   ';}b_G+=b_f+'BREADCRUMBS...\n\n'+b_J;b_G+=b_f+'TIME STARTED: '+b_E.b_N+'\n'+
'TIME ENDED: '+b_E.b_O+'\n'+'DURATION: '+b_E.b_P+'ms\n';if(!b_F&&b_o)b_G+=b_f+'REASON FOR FAILURE...\n\n'+b_o;return b_G;};b_h.stop=function(){var b_E=this;Uize.isArray(b_E.b_D)&&Uize.callOn(b_E.b_D,'stop');b_E.set({b_Q:false});};b_h.run=function(b_R){var b_E=this,b_D=b_E.b_D,b_S=b_b;b_E.stop();b_E.set({b_Q:b_b,b_T:0,b_N:new Date,b_P:b_d,b_O:b_d,b_U:b_c,b_V:[],b_F:b_d,b_o:b_d});b_E.fire({name:'Start',bubble:b_b});function b_W(){if(b_S!==b_b&&b_S!==b_d&&b_S!=b_U)b_S=b_c;b_E.set({b_F:b_S});if(b_S==b_U){b_E.set({b_U:b_b});}else{var b_O=new Date;b_E.set({b_P:b_O-b_E.b_N,b_O:b_O,b_T:1});b_E.stop();b_E.fire({name:'Done',bubble:b_b});b_E.b_U&&b_R&&b_R(b_S);}}if(Uize.isArray(b_D)){var b_X=b_D.length,b_Y= -1;function b_Z(){b_E.set({b_T:(b_Y+1)/b_X});function b_0(b_F){b_S=b_F;b_Z();}while(b_E.b_Q&&b_S===b_b&& ++b_Y<b_X)b_S=b_D[b_Y].run(b_0);b_W();}b_Z();}else{try{b_S=b_U;var b_1=b_c,b_2=b_D.call(b_E,function(b_F){b_S=b_F;b_1&&b_W();});if(b_2!==b_d)b_S=b_2;b_1=true;}catch(b_3){b_E.set({b_o:'JavaScript Error...\n'+
'ERROR NAME: '+b_3.name+'\n'+'ERROR MESSAGE: '+b_3.message+'\n'+'ERROR DESCRIPTION: '+b_3.description+'\n'+'LINE NUMBER: '+b_3.number+'\n'});b_S=b_c;}if(b_S!=b_U&&b_e){var b_4=b_S;b_S=b_U;b_W();setTimeout(function(){b_S=b_4;b_W();},0);}else{b_W();}}return b_S;};b_h.log=function(b_5){this.b_V.push({timestamp:new Date,message:b_5});};var b_U=b_g.isAsync=function(){};b_g.addTest=function(b_D){(this.b_D||(this.b_D=[])).push(this.declare(b_D));return this;};var b_6=b_g.splitHostAndProperty=function(b_7){var b_8=b_7.lastIndexOf('.');return{host:b_7.slice(0,b_8),property:b_7.slice(b_8+1)};};b_g.declare=function(b_D){if(!Uize.Util.Oop.inheritsFrom(b_D,Uize.Test)){var b_9=b_D;var b_A=b_9.test;if(Uize.isArray(b_A)){for(var b_B= -1,b_C=b_A.length,b_ba;++b_B<b_C;)if((b_ba=b_A[b_B]).constructor==Object)b_A[b_B]=this.declare(b_ba);}(b_D=this.subclass()).set(b_9);}return b_D;};b_g.requiredModulesTest=function(b_bb){return this.declare({title:'REQUIRED MODULES TEST: '+b_bb,test:function(b_Z){Uize.module({required:b_bb,
builder:function(){b_Z(true)}});}});};b_g.staticPropertyTest=function(b_7,b_q){var b_bc=b_6(b_7),b_bd=b_bc.host;return this.declare({title:'Test that '+b_7+' exists and is a '+b_q,test:[{title:'Test that host '+b_bd+' is defined',test:function(){return this.expectNonNull(eval(b_bd))}},{title:'Test that '+b_7+' is a '+b_q,test:function(){return this.expectType(b_q,eval(b_bd)[b_bc.property]);}}]});};b_g.staticMethodTest=function(b_be,b_bf,b_9,b_bg){var b_E=this,b_bc=b_6(b_be),b_bh=b_bc.host,b_bi=b_bc.property,b_D=[b_E.staticPropertyTest(b_be,'function')];function b_bj(b_bk){var b_bl=Uize.isArray(b_bk)?{title:b_bk[0],test:function(){var b_bm=eval(b_bh),b_bn=this.get('cloneArguments')?Uize.clone(b_bk[1]):b_bk[1];return this.expect(b_bk[2],b_bm[b_bi].apply(b_bm,Uize.isArray(b_bn)?b_bn:[b_bn]));}}:b_bk;if(b_bg)Uize.Util.Oop.inheritsFrom(b_bl,Uize.Test)?b_bl.set(b_bg):Uize.copyInto(b_bl,b_bg);return b_bl;}for(var b_bo= -1,b_bp=b_bf.length;++b_bo<b_bp;)b_D.push(b_bj(b_bf[b_bo]));var b_bq=b_E.declare(Uize.copyInto({
title:'STATIC METHOD TEST: '+b_be,test:b_D},b_9));return b_bq;};b_g.staticMethodsTest=function(b_br){var b_E=this;return b_E.declare({title:'Static Method Tests',test:Uize.map(b_br,function(b_bs){return(Uize.isArray(b_bs)?b_E.staticMethodTest.apply(b_E,b_bs):b_bs);})});};b_g.testModuleTest=function(b_bt){var b_bu=this.requiredModulesTest(b_bt);b_bu.set({b_L:'REQUIRE TEST MODULE: '+b_bt});return this.declare({title:'TEST MODULE: '+b_bt,test:[b_bu,{title:'RUN TEST MODULE: '+b_bt,test:function(b_Z){var b_E=this,b_bv=new(eval(b_bt));b_bv.wire('Done',function(b_bw){var b_bx=b_bw.source;b_bx.b_o&&b_E.set({b_o:'running test module failed with the following synopsis...\n\n'+b_bx.getSynopsis()});b_bx.parent||b_Z(b_bx.b_F);});b_bv.run();}}]});};b_g.testSuite=function(b_by,b_bz){var b_E=this;return b_E.declare({title:b_by,test:Uize.map(b_bz,function(b_bA){return b_E.testModuleTest(b_bA)})});};b_g.registerProperties({b_P:'duration',b_O:'endTime',b_Q:{name:'inProgress',value:b_c},b_U:'isAsync',b_V:'log',b_T:{
name:'progress',value:0},b_o:'reasonForFailure',b_F:'result',b_N:'startTime',b_D:{name:'test',conformer:function(b_j){if(Uize.isArray(b_j)){var b_E=this;b_j=Uize.map(b_j,function(b_ba){return new b_ba({parent:b_E})});}return b_j;}},b_L:'title'});return b_g;}});