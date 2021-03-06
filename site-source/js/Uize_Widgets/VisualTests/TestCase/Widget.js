/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualTests.TestCase.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.VisualTests.TestCase.Widget= class implements a widget for a widget test case, to be used when building visual tests for widgets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.VisualTests.TestCase.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Widgets.VisualTests.TestCase.Html',
		'Uize.Json',
		'Uize.Xml'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				var _this = this;
				_this.onChange (
					'state',
					function (_state) {_this.set ({heading:Uize.Xml.toAttributeValue (Uize.Json.to (_state))})}
				);
			},

			set:{
				html:Uize.Widgets.VisualTests.TestCase.Html
			}
		});
	}
});

