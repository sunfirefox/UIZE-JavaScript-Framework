/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.Dialog.Confirm.js.jst
*/

Uize.module ({
	name:'UizeSite.Templates.Dialog.Confirm',
	required:[
		'UizeSite.Templates.Dialog'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				function dialogContents () {var output = [];
				output.push ('\r\n			<table>\r\n				<tr>\r\n					<td><div class="dialogIcon dialogConfirmIcon" id="',input. idPrefix,'-icon">&nbsp;</div></td>\r\n					<td><div id="',input. idPrefix,'-message" class="dialogMessage">',input .message || '','</div></td>\r\n				</tr>\r\n			</table>');
				return output.join ('');}
				output.push ('\r\n',UizeSite.Templates.Dialog.process ({idPrefix:input.idPrefix,title:input.title,contents:dialogContents ()}),'\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				message:'string',
				title:'string'
			};

		return _package;
	}
});
