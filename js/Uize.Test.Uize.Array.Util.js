/*
	UIZE JAVASCRIPT FRAMEWORK 2011-10-30

	http://www.uize.com/reference/Uize.Test.Uize.Array.Util.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Uize.Array.Util',builder:function(){return Uize.Test.declare({title:'Uize.Array.Util Module Test',test:[Uize.Test.requiredModulesTest('Uize.Array.Util'),Uize.Test.staticMethodsTest([['Uize.Array.Util.replaceContents',[{title:'Test that this method returns a reference to the array whose elements are being replaced',test:function(){var _a=[],_b=[1,2,3],_c=Uize.Array.Util.replaceContents(_a,_b);return this.expectSameAs(_a,_c);}},{title:'Test that the array whose elements are being used as the replacement elements is not modified',test:function(){var _a=[],_b=[1,2,3],_c=Uize.Array.Util.replaceContents(_a,_b);return this.expect([1,2,3],_b);}},{title:'Test that this method produces the expected result and doesn\'t explode when the same array is specified for array A and array B',test:function(){var _a=[1,2,3],_c=Uize.Array.Util.replaceContents(_a,_a);return this.expect([1,2,3],_c)&&this.expect([1,2,3],_a);}},
['Test that replacing the contents of an empty array A with the contents of an empty array B leaves array A empty',[[],[]],[]],['Test that replacing the contents of an empty array A with the contents of a non-empty array B leaves array A with the elements of array B',[[],[1,2,3]],[1,2,3]],['Test that replacing the contents of a non-empty array A with the contents of a non-empty array B leaves array A with the elements of array B',[[1,2,3],[4,5,6]],[4,5,6]],['Test that not specifying a second array results in the first array being emptied out',[[1,2,3]],[]],['Test that specifying the value null for the second array results in the first array being emptied out',[[1,2,3],null],[]],['Test that specifying the value undefined for the second array results in the first array being emptied out',[[1,2,3],undefined],[]]],null,{cloneArguments:true}],['Uize.Array.Util.swapContents',[{title:'Test that this method returns a reference to array A',test:function(){var _a=[1,2,3],_b=[4,5,6,7,8],
_c=Uize.Array.Util.swapContents(_a,_b);return this.expectSameAs(_a,_c);}},{title:'Test that this method produces the expected result and doesn\'t explode when the same array is specified for array A and array B',test:function(){var _a=[1,2,3],_c=Uize.Array.Util.swapContents(_a,_a);return this.expect([1,2,3],_c)&&this.expect([1,2,3],_a);}},{title:'Test that swapping the contents of an empty array A with a non-empty array B behaves as expected',test:function(){var _a=[],_b=[1,2,3];Uize.Array.Util.swapContents(_a,_b);return this.expect([1,2,3],_a)&&this.expect([],_b);}},{title:'Test that swapping the contents of a non-empty array A with an empty array B behaves as expected',test:function(){var _a=[1,2,3],_b=[];Uize.Array.Util.swapContents(_a,_b);return this.expect([],_a)&&this.expect([1,2,3],_b);}},{title:'Test that swapping the contents of a non-empty array A with a non-empty array B behaves as expected',test:function(){var _a=[1,2,3],_b=[4,5,6,7,8];Uize.Array.Util.swapContents(_a,_b);
return this.expect([4,5,6,7,8],_a)&&this.expect([1,2,3],_b);}},{title:'Test that swapping the contents of an empty array A with an empty array B behaves as expected',test:function(){var _a=[],_b=[];Uize.Array.Util.swapContents(_a,_b);return this.expect([],_a)&&this.expect([],_b);}}]],['Uize.Array.Util.flatten',[['Test that flattening an empty array results in an empty array, as expected',[[]],[]],['Test that flattening an array that is already flat is handled correctly',[[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]],['Test that flattening a non-flat array to a depth of 0 leaves the array unflattened',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],0],[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0]],['Test that flattening a non-flat array to a depth of 1 is handled correctly',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],1],[0,0,1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1,0,0]],
['Test that flattening a non-flat array to a depth of 2 is handled correctly',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],2],[0,0,1,1,2,2,[3,3,[4,4,4,4],3,3],2,2,1,1,0,0]],['Test that flattening a non-flat array to a depth of Infinity is handled correctly',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],Infinity],[0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0]],['Test that when the optional depth parameter is not specified, its value is defaulted to Infinity',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0]],[0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0]],['Test that when the value undefined is specified for the optional depth parameter, its value is defaulted to Infinity',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],undefined],[0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0]],['Test that when the value null is specified for the optional depth parameter, its value is defaulted to Infinity',[[0,0,[1,1,[2,2,[3,3,[4,4,4,4],3,3],2,2],1,1],0,0],null],[0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,0,0]],{
title:'Test that the optional target parameter is defaulted to false if no value is specified for it',test:function(){var _d=[1,[2,[3,[4],5],6],7],_c=Uize.Array.Util.flatten(_d);return this.expect([1,2,3,4,5,6,7],_c)&&this.expectSameAs(_d,_c);}},{title:'Test that the optional target parameter is defaulted to false if no value is specified for it',test:function(){var _d=[1,[2,[3,[4],5],6],7],_c=Uize.Array.Util.flatten(_d);return this.expect([1,2,3,4,5,6,7],_c)&&this.expectSameAs(_d,_c);}},{title:'Test that when the value false is specified for the optional target parameter, the result replaces the source array\'s original contents',test:function(){var _d=[1,[2,[3,[4],5],6],7],_c=Uize.Array.Util.flatten(_d,null,false);return this.expect([1,2,3,4,5,6,7],_c)&&this.expectSameAs(_d,_c);}},{title:'Test that when the value true is specified for the optional target parameter, the result is returned in a new array and the source array is not modified',test:function(){var _d=[1,[2,[3,[4],5],6],7],
_c=Uize.Array.Util.flatten(_d,null,true);return(this.expect([1,2,3,4,5,6,7],_c)&&this.expect([1,[2,[3,[4],5],6],7],_d)&&this.expect(true,_c!=_d));}},{title:'Test that when a different array is specified for the target parameter, the result replaces the contents of that array and the source array is not modified',test:function(){var _d=[1,[2,[3,[4],5],6],7],_e=['a','whole','bunch','of','crap','that','goes','bye','bye'],_c=Uize.Array.Util.flatten(_d,null,_e);return(this.expectSameAs(_e,_c)&&this.expect([1,2,3,4,5,6,7],_e)&&this.expect([1,[2,[3,[4],5],6],7],_d));}},{title:'Test that when the source array is specified as the target array, the result replaces the source array\'s original contents',test:function(){var _d=[1,[2,[3,[4],5],6],7],_c=Uize.Array.Util.flatten(_d,null,false);return this.expect([1,2,3,4,5,6,7],_c)&&this.expectSameAs(_d,_c);}}],null,{cloneArguments:true}]])]});}});