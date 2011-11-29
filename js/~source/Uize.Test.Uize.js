/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 38
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize= module defines a suite of unit tests for the =Uize= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize',
	required:'Uize.Data',
	builder:function () {
		var
			_oneLevelDeepTestObjectForCloning = {
				undefinedValue:undefined,
				nullValue:null,
				emptyString:'',
				nonEmptyString:'solar',
				numberValueZero:0,
				numberValueNegative:-1,
				numberValuePositive:1,
				numberValueNaN:NaN,
				numberValueInfinity:Infinity,
				numberValueNegativeInfinity:-Infinity,
				booleanFalse:false,
				booleanTrue:true
			},
			_oneLevelDeepTestArrayForCloning = [
				undefined,
				null,
				'',
				'solar',
				0,
				-1,
				1,
				NaN,
				Infinity,
				-Infinity,
				false,
				true
			],
			_complexObjectDataStructure = {
				anObject:_oneLevelDeepTestObjectForCloning,
				anArray:_oneLevelDeepTestArrayForCloning
			},
			_complexArrayDataStructure = [
				_oneLevelDeepTestObjectForCloning,
				_oneLevelDeepTestArrayForCloning
			],
			_sparselyPopulatedArray = []
		;
		_sparselyPopulatedArray [2] = 1;
		_sparselyPopulatedArray [7] = 2;

		/*** create dummy class with value interface ***/
			var _ClassWithValueInterface = Uize.subclass ();
			_ClassWithValueInterface.registerProperties ({
				_value:'value'
			});

		function _copyArguments (_arguments) {
			var _result = [];
			_result.push.apply (_result,_arguments);
			return _result;
		}

		function _cloneObjectTest (_title,_class,_instantiationValue) {
			return {
				title:_title,
				test:function () {
					var
						_sourceObject = new _class (_instantiationValue),
						_clonedObject = Uize.clone (_sourceObject)
					;
					return (
						this.expect (true,_clonedObject != _sourceObject) &&
						this.expectSameAs (_sourceObject.constructor,_clonedObject.constructor) &&
						this.expect (_sourceObject.valueOf (),_clonedObject.valueOf ())
					);
				}
			};
		}

		function _eventsSystemTest (_title,_isInstance) {
			function _getEventSource () {
				return _isInstance ? new Uize : Uize.subclass ();
			}
			return {
				title:_title,
				test:[
					{
						title:'Test that firing an event for which no handler is registered has no ill effect',
						test:function () {
							_getEventSource ().fire ('testEvent');
							return true;
						}
					},
					{
						title:'Test that firing an event for which a handler is registered works correctly',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_success = true});
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that an event handler function receives a single object parameter, and that this event object contains a name property whose value matches the name of the fired event',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_success =
										arguments.length == 1 &&
										typeof _event == 'object' && _event &&
										_event.name == 'testEvent'
									;
								}
							);
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that the event object provided to an event handler has a source property, whose value is a reference to the object on which the event was fired',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function (_event) {_success = _event.source === _eventSource});
							_eventSource.fire ('testEvent');
							return _success;
						}
					},
					{
						title:
							'Test that firing an event for which two handlers are registered results in the handlers being exucuted in the order registered',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler2',_coverageAndOrder + '');
						}
					},
					{
						title:
							'Test that firing an event for which more than two handlers are registered results in the handlers being exucuted in the order registered',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler4')});
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler2,handler3,handler4',_coverageAndOrder + '');
						}
					},
					{
						title:'Test that firing an event using the alternate event object form is handled correctly',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_success = true});
							_eventSource.fire ({name:'testEvent'});
							return _success;
						}
					},
					{
						title:
							'Test that extra event object properties that are specified when firing an event are accessible on the event object in the handler',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {_success = _event.foo == 'bar' && _event.hello == 'world'}
							);
							_eventSource.fire ({
								name:'testEvent',
								foo:'bar',
								hello:'world'
							});
							return _success;
						}
					},
					{
						title:
							'Test that the same event object is passed to all handlers for an event and is also returned as the result of the fire method',
						test:function () {
							var
								_eventSource = _getEventSource (),
								_handler1ReceivedEvent,
								_handler2ReceivedEvent
							;
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_handler1ReceivedEvent = _event;
									_event.foo = 'bar';
								}
							);
							_eventSource.wire (
								'testEvent',
								function (_event) {
									_handler2ReceivedEvent = _event;
									_event.hello = 'world';
								}
							);
							var _event = _eventSource.fire ('testEvent');
							return (
								_event == _handler1ReceivedEvent &&
								_event == _handler2ReceivedEvent &&
								_event.foo == 'bar' && _event.hello == 'world'
							);
						}
					},
					{
						title:'Test that unwiring an event handler results in that handler no longer being executed',
						test:function () {
							var
								_success = false,
								_eventSource = _getEventSource ()
							;
							function _handler () {_success = !_success}

							_eventSource.wire ('testEvent',_handler);
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('testEvent',_handler);
							_eventSource.fire ('testEvent');

							return _success;
						}
					},
					{
						title:
							'Test that the special wildcard event name results in the handler being executed for all events, and that it can be unwired successfully',
						test:function () {
							var
								_expectedCoverageAndOrder = 'testEvent1,testEvent2,testEvent3',
								_handler1CoverageAndOrder = [],
								_handler2CoverageAndOrder = [],
								_handler3CoverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							function _handler1 (_event) {_handler1CoverageAndOrder.push (_event.name)}
							function _handler2 (_event) {_handler2CoverageAndOrder.push (_event.name)}
							function _handler3 (_event) {_handler3CoverageAndOrder.push (_event.name)}

							_eventSource.wire ('*',_handler1);
							_eventSource.wire ('*',_handler2);
							_eventSource.wire ('*',_handler3);
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');
							_eventSource.unwire ('*',_handler1);
							_eventSource.unwire ('*',_handler2);
							_eventSource.unwire ('*',_handler3);
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');

							return (
								_handler1CoverageAndOrder + '' == _expectedCoverageAndOrder &&
								_handler2CoverageAndOrder + '' == _expectedCoverageAndOrder &&
								_handler3CoverageAndOrder + '' == _expectedCoverageAndOrder
							);
						}
					},
					{
						title:
							'Test that when the second of three event handlers is unwired, the execution order of the remaining two handlers is preserved',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler1')});
							function _handler2 () {_coverageAndOrder.push ('handler2')}
							_eventSource.wire ('testEvent',_handler2);
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.unwire ('testEvent',_handler2);
							_eventSource.fire ('testEvent');
							return this.expect ('handler1,handler3',_coverageAndOrder + '');
						}
					},
					{
						title:
							'Test that wiring handlers for multiple different events using the event-names-to-handlers map is handled correctly',
						test:function () {
							var
								_event1HandlerCalled,
								_event2HandlerCalled,
								_event3HandlerCalled,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ({
								testEvent1:function () {_event1HandlerCalled = true},
								testEvent2:function () {_event2HandlerCalled = true},
								testEvent3:function () {_event3HandlerCalled = true}
							});
							_eventSource.fire ('testEvent1');
							_eventSource.fire ('testEvent2');
							_eventSource.fire ('testEvent3');
							return _event1HandlerCalled && _event2HandlerCalled && _event3HandlerCalled;
						}
					},
					{
						title:
							'Test that unwiring handlers for multiple different events using the event-names-to-handlers map is handled correctly',
						test:function () {
							var
								_event1Success = false,
								_event2Success = false,
								_event3Success = false,
								_eventSource = _getEventSource ()
							;
							function _fireAllEvents () {
								_eventSource.fire ('testEvent1');
								_eventSource.fire ('testEvent2');
								_eventSource.fire ('testEvent3');
							}
							var _eventsToHandlersMap = {
								testEvent1:function () {_event1Success = !_event1Success},
								testEvent2:function () {_event2Success = !_event2Success},
								testEvent3:function () {_event3Success = !_event3Success}
							};
							_eventSource.wire (_eventsToHandlersMap);
							_fireAllEvents();
							_eventSource.unwire (_eventsToHandlersMap);
							_fireAllEvents();
							return _event1Success && _event2Success && _event3Success;
						}
					},
					{
						title:
							'Test that not specifying a handler when unwiring an event results in all handlers for that event being unwired',
						test:function () {
							var
								_handler1Success = false,
								_handler2Success = false,
								_handler3Success = false,
								_eventSource = _getEventSource ()
							;
							_eventSource.wire ('testEvent',function () {_handler1Success = !_handler1Success});
							_eventSource.wire ('testEvent',function () {_handler2Success = !_handler2Success});
							_eventSource.wire ('testEvent',function () {_handler3Success = !_handler3Success});
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('testEvent');
							_eventSource.fire ('testEvent');

							return _handler1Success && _handler2Success && _handler3Success;
						}
					},
					{
						title:
							'Test that unwiring a handler for the special wildcard event results in just that handler being unwired, rather than all handlers for the wildcard event or all handlers for all events',
						test:function () {
							var
								_coverageAndOrder = [],
								_eventSource = _getEventSource ()
							;
							function _handler1 () {_coverageAndOrder.push ('handler1')}
							_eventSource.wire ('*',_handler1);
							_eventSource.wire ('*',function () {_coverageAndOrder.push ('handler2')});
							_eventSource.wire ('testEvent',function () {_coverageAndOrder.push ('handler3')});
							_eventSource.fire ('testEvent');
							_eventSource.unwire ('*',_handler1);
							_eventSource.fire ('testEvent');

							return this.expect ('handler1,handler2,handler3,handler2,handler3',_coverageAndOrder + '');
						}
					},
					_isInstance
						? {
							title:'Test that event bubbling works correctly for instances',
							test:[
								{
									title:
										'Test that setting the bubble event property to true when firing an event on an instance with no parent is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_success = false
										;
										_eventSource.wire ('testEvent',function () {_success = true});
										_eventSource.fire ({name:'testEvent',bubble:true});
										return _success;
									}
								},
								{
									title:
										'Test that setting the bubble event property to true when firing an event on an instance with a parent causes that event to fire first on the instance and then on its parent',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler,sourceParentHandler',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that a bubbling event is fired on all instances up the parent chain',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_expectedCoverageAndOrder = [
												'sourceHandler',
												'sourceParentHandler',
												'sourceParentParentHandler'
											]
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [0])}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [1])}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push (_expectedCoverageAndOrder [2])}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect (_expectedCoverageAndOrder + '',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that the event object provided to all handlers of a bubbling event up the parent chain is the same event object',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_eventSourceHandlerReceivedEvent,
											_eventSourceParentHandlerReceivedEvent,
											_eventSourceParentParentHandlerReceivedEvent,
											_eventFired = {
												name:'testEvent',
												bubble:true
											}
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function (_event) {
												_eventSourceHandlerReceivedEvent = _event;
												_event.foo = 'bar';
											}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {
												_eventSourceParentHandlerReceivedEvent = _event;
												_event.hello = 'world';
											}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function (_event) {
												_eventSourceParentParentHandlerReceivedEvent = _event;
												_event.duck = 'typing';
											}
										);
										var _event = _eventSource.fire (_eventFired);
										return (
											_event == _eventFired &&
											_eventSourceHandlerReceivedEvent == _eventFired &&
											_eventSourceParentHandlerReceivedEvent == _eventFired &&
											_eventSourceParentParentHandlerReceivedEvent == _eventFired &&
											_event.foo == 'bar' && _event.hello == 'world' && _event.duck == 'typing'
										);
									}
								},
								{
									title:
										'Test that a bubbling event can be canceled by a handler of the bubbled event, so that it will not be fired on a higher parent',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {
												_coverageAndOrder.push ('sourceParentHandler');
												_event.bubble = false;
											}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler,sourceParentHandler',_coverageAndOrder + '');
									}
								},
								{
									title:
										'Test that the event object for a bubbling event always has the instance on which the event was originally fired as the value for the source property',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource (),
											_eventSourceParentParent = _getEventSource (),
											_eventSourceHandlerSource,
											_eventSourceParentHandlerSource,
											_eventSourceParentParentHandlerSource
										;
										_eventSource.parent = _eventSourceParent;
										_eventSourceParent.parent = _eventSourceParentParent;
										_eventSource.wire (
											'testEvent',
											function (_event) {_eventSourceHandlerSource = _event.source}
										);
										_eventSourceParent.wire (
											'testEvent',
											function (_event) {_eventSourceParentHandlerSource = _event.source}
										);
										_eventSourceParentParent.wire (
											'testEvent',
											function (_event) {_eventSourceParentParentHandlerSource = _event.source}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return (
											_eventSourceHandlerSource == _eventSource &&
											_eventSourceParentHandlerSource == _eventSource &&
											_eventSourceParentParentHandlerSource == _eventSource
										);
									}
								}
							]
						} : {
							title:'Test that event bubbling is ignored for classes',
							test:[
								{
									title:
										'Test that setting the bubble event property to true when firing an event on a class with no parent (as it should be) is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_eventSource = _getEventSource (),
											_success = false
										;
										_eventSource.wire ('testEvent',function () {_success = true});
										_eventSource.fire ({name:'testEvent',bubble:true});
										return _success;
									}
								},
								{
									title:
										'Test that setting the bubble event property to true when firing an event on a class with a parent (which is not exactly valid) is not fatal and results in a handler wired for that event being executed',
									test:function () {
										var
											_coverageAndOrder = [],
											_eventSource = _getEventSource (),
											_eventSourceParent = _getEventSource ()
										;
										_eventSource.parent = _eventSourceParent;
										_eventSource.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceHandler')}
										);
										_eventSourceParent.wire (
											'testEvent',
											function () {_coverageAndOrder.push ('sourceParentHandler')}
										);
										_eventSource.fire ({name:'testEvent',bubble:true});
										return this.expect ('sourceHandler',_coverageAndOrder + '');
									}
								}
							]
						}
				]
			};
		}

		function _setMethodTest (_title,_isInstance) {
			return {
				title:_title,
				test:[
					{
						title:
							'Test that values can be set for multiple properties by calling the set method with a single argument, which is an object containing an arbitrary number of property name to property value mappings',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{},
								property2:{},
								property3:{}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({
								property1:'property1Value',
								property2:'property2Value',
								property3:'property3Value'
							});
							return (
								this.expect ('property1Value',_testContext.get ('property1')) &&
								this.expect ('property2Value',_testContext.get ('property2')) &&
								this.expect ('property3Value',_testContext.get ('property3'))
							);
						}
					},
					{
						title:
							'Test that a value can be set for a single property by calling the set method with two arguments, where the first argument is the property\'s name and the second is the property\'s value',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({property1:{}});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					},
					{
						title:
							'Test that values can be set for multiple properties by calling the set method with more than two arguments, where the arguments are property name-value pairs',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{},
								property2:{},
								property3:{}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set (
								'property1','property1Value',
								'property2','property2Value',
								'property3','property3Value'
							);
							return (
								this.expect ('property1Value',_testContext.get ('property1')) &&
								this.expect ('property2Value',_testContext.get ('property2')) &&
								this.expect ('property3Value',_testContext.get ('property3'))
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, the set method sets a value for a property using the private name of the set-get property and not its public name',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return (
								this.expect (undefined,_testContext.property1) &&
								this.expect ('property1Value',_testContext._property1)
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, a value can be set for the property by specifying its private name when calling the set method',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({_property1:'property1Value'});
							return this.expect ('property1Value',_testContext._property1);
						}
					}
				]
			};
		}

		function _getMethodTest (_title,_isInstance) {
			return {
				title:_title,
				test:[
					{
						title:
							'Test that the value of a single set-get property can be obtained by calling the get method with a single string argument, specifying the name of the property',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					},
					{
						title:
							'Test that values can be obtained for multiple properties by calling the get method with a single argument, which is a list of property names',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get (['property1','property2','property3'])
							);
						}
					},
					{
						title:
							'Test that values can be obtained for multiple properties by calling the get method with a single argument, which is an object whose properties are the properties of the instance whose values should be obtained',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get ({property1:0,property2:0,property3:0})
							);
						}
					},
					{
						title:
							'Test that values can be obtained for all properties by calling the get method with no arguments',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({
								property1:{value:'property1Value'},
								property2:{value:'property2Value'},
								property3:{value:'property3Value'}
							});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							return this.expect (
								{
									property1:'property1Value',
									property2:'property2Value',
									property3:'property3Value'
								},
								_testContext.get ()
							);
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name, the value can be obtained for the property by specifying its private name when calling the get method',
						test:function () {
							var
								_Subclass = Uize.subclass (),
								_properties = {_property1:'property1'}
							;
							for (var _propertyPrivateName in _properties);
							_Subclass.registerProperties (_properties);
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ('property1','property1Value');
							return this.expect ('property1Value',_testContext.get (_propertyPrivateName));
						}
					},
					{
						title:
							'Test that, when a private name for a set-get property is different from its publice name and its value is set using its private name, the value can be obtained for the property by specifying its public name when calling the get method',
						test:function () {
							var _Subclass = Uize.subclass ();
							_Subclass.registerProperties ({_property1:'property1'});
							var _testContext = _isInstance ? new _Subclass : _Subclass;
							_testContext.set ({_property1:'property1Value'});
							return this.expect ('property1Value',_testContext.get ('property1'));
						}
					}
				]
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize Base Class',
			test:[
				Uize.Test.staticMethodsTest ([
					['Uize.capFirstChar',[
						['Many letters, first letter is lowercase','hello','Hello'],
						['Many letters, first letter is uppercase','Hello','Hello'],
						['Single letter, lowercase','h','H'],
						['Single letter, uppercase','H','H'],
						['Empty string','','']
					]],
					['Uize.constrain',[
						['Test that constraining a value that is lower than the lower limit returns the lower limit',
							[-20,-10,10],
							-10
						],
						['Test that constraining a value that is equal to the lower limit returns that value',
							[-10,-10,10],
							-10
						],
						['Test that constraining a value that is higher than the upper limit returns the upper limit',
							[20,-10,10],
							10
						],
						['Test that constraining a value that is equal to the upper limit returns that value',
							[10,-10,10],
							10
						],
						['Test that constraining value that is within the range simply returns that value',
							[1,-10,10],
							1
						],
						['Test that, when the range is reversed, constraining a value that is lower than the lower limit returns the lower limit',
							[-20,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the lower limit returns that value',
							[-10,10,-10],
							-10
						],
						['Test that, when the range is reversed, constraining a value that is higher than the upper limit returns the upper limit',
							[20,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining a value that is equal to the upper limit returns that value',
							[10,10,-10],
							10
						],
						['Test that, when the range is reversed, constraining value that is within the range simply returns that value',
							[1,10,-10],
							1
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is lower than the lower limit returns the lower limit',
							[5,10,10],
							10
						],
						['Test that, when the lower limit and the upper limit are equal, constraining a value that is higher than the upper limit returns the upper limit',
							[15,10,10],
							10
						]
					]],
					['Uize.inRange',[
						['Test that a number that is lower than the lower bound of a range is not considered in range',
							[-50,100,0],
							false
						],
						['Test that a number that is at the lower bound of a range is considered in range',
							[0,100,0],
							true
						],
						['Test that a number that is between the lower and upper bounds of a range is considered in range',
							[50,100,0],
							true
						],
						['Test that a number that is at the upper bound of a range is considered in range',
							[100,100,0],
							true
						],
						['Test that a number that is higher than the upper bound of a range is not considered in range',
							[150,100,0],
							false
						],

						/*** test support for date values ***/
							['Test that a date that falls before the lower bound of a date range is not considered in range',
								[new Date ('01/01/1999'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],
							['Test that a date that is at the lower bound of a date range is considered in range',
								[new Date ('01/01/2000'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that is between the lower and upper bounds of a date range is considered in range',
								[new Date ('01/01/2005'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that is at the upper bound of a date range is considered in range',
								[new Date ('01/01/2010'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								true
							],
							['Test that a date that falls after the upper bound of a date range is not considered in range',
								[new Date ('01/01/2011'),new Date ('01/01/2000'),new Date ('01/01/2010')],
								false
							],

						/*** test support for object's with valueOf implemented ***/
							['Test that an object whose value is lower than the lower bound of a range is not considered in range',
								[
									new _ClassWithValueInterface ({value:-50}),
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:100})
								],
								false
							],
							['Test that an object whose value is at the lower bound of a range is considered in range',
								[
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:100})
								],
								true
							],
							['Test that an object whose value is between the lower and upper bounds of a range is considered in range',
								[
									new _ClassWithValueInterface ({value:50}),
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:100})
								],
								true
							],
							['Test that an object whose value is at the upper bound of a range is considered in range',
								[
									new _ClassWithValueInterface ({value:100}),
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:100})
								],
								true
							],
							['Test that an object whose value is higher than the upper bound of a range is not considered in range',
								[
									new _ClassWithValueInterface ({value:150}),
									new _ClassWithValueInterface ({value:0}),
									new _ClassWithValueInterface ({value:100})
								],
								false
							],

						/*** test support for strings ***/
							['Test that a string that falls before the lower bound of a string range is not considered in range',
								['a','b','y'],
								false
							],
							['Test that a string that is at the lower bound of a string range is considered in range',
								['b','b','y'],
								true
							],
							['Test that a string that is between the lower and upper bounds of a string range is considered in range',
								['m','b','y'],
								true
							],
							['Test that a string that is at the upper bound of a string range is considered in range',
								['y','b','y'],
								true
							],
							['Test that a string that falls after the upper bound of a string range is not considered in range',
								['z','b','y'],
								false
							],

						/*** test support for reversed range bounds ***/
							['Test that, when the bounds of a range are reversed, a value that is lower than the lower bound of the range is not considered in range',
								[-50,100,0],
								false
							],
							['Test that, when the bounds of a range are reversed, a value that is at the lower bound of the range is considered in range',
								[0,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is between the lower and upper bounds of the range is considered in range',
								[50,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is at the upper bound of the range is considered in range',
								[100,100,0],
								true
							],
							['Test that, when the bounds of a range are reversed, a value that is higher than the upper bound of the range is not considered in range',
								[150,100,0],
								false
							]
					]],
					['Uize.defaultNully',[
						['Test that the value null is defaulted',[null,'foo'],'foo'],
						['Test that the value undefined is defaulted',[undefined,'foo'],'foo'],
						['Test that the boolean value false is not defaulted',[false,'foo'],false],
						['Test that an empty string is not defaulted',['','foo'],''],
						['Test that the number value 0 is not defaulted',[0,'foo'],0],
						['Test that the special value NaN is not defaulted',[NaN,'foo'],NaN],
						{
							title:'Test that an object type value is not defaulted',
							test:function () {
								var _object = {};
								return this.expectSameAs (_object,Uize.defaultNully (_object,'foo'));
							}
						},
						{
							title:'Test that an array type value is not defaulted',
							test:function () {
								var _array = [];
								return this.expectSameAs (_array,Uize.defaultNully (_array,'foo'));
							}
						},
						{
							title:'Test that a function type value is not defaulted',
							test:function () {
								var _function = function () {};
								return this.expectSameAs (_function,Uize.defaultNully (_function,'foo'));
							}
						}
					]],
					['Uize.isArray',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as an array',undefined,false],
						['Test that the value null is not regarded as an array',null,false],
						['Test that a string type value is not regarded as an array','hello',false],
						['Test that a String object instance is not regarded as an array',new String ('hello'),false],
						['Test that a number type value is not regarded as an array',5,false],
						['Test that a Number object instance is not regarded as an array',new Number (5),false],
						['Test that a boolean type value is not regarded as an array',true,false],
						['Test that a Boolean object instance is not regarded as an array',new Boolean (true),false],
						['Test that an empty object is not regarded as an array',{},false],
						['Test that a function is not regarded as an array',function () {},false],
						['Test that a regular expression instance is not regarded as an array',/\d+/,false],
						['Test that an empty array is regarded as an array',[[]],true],
						['Test that an array with elements is regarded as an array',[[1,2,3,4]],true]
					]],
					['Uize.isNumber',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a number',undefined,false],
						['Test that the value null is not regarded as a number',null,false],
						['Test that a number format string type value is not regarded as a number','5',false],
						['Test that a number format String object instance is not regarded as a number',new String ('5'),false],
						['Test that a boolean type value is not regarded as a number',true,false],
						['Test that a Boolean object instance is not regarded as a number',new Boolean (true),false],
						['Test that an object is not regarded as a number',{},false],
						['Test that an array is not regarded as a number',[[]],false],
						['Test that a function is not regarded as a number',function () {},false],
						['Test that a regular expression instance is not regarded as a number',/\d+/,false],
						['Test that a number type value is regarded as a number',5,true],
						['Test that the special value Infinity is regarded as a number',Infinity,true],
						['Test that the special value -Infinity is regarded as a number',-Infinity,true],
						['Test that the special value NaN is not regarded as a number',NaN,false],
						['Test that a Number object instance is not regarded as a number',new Number (5),false]
					]],
					['Uize.isString',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a string',undefined,false],
						['Test that the value null is not regarded as a string',null,false],
						['Test that a boolean type value is not regarded as a string',true,false],
						['Test that a Boolean object instance is not regarded as a string',new Boolean (true),false],
						['Test that an object is not regarded as a string',{},false],
						['Test that an array is not regarded as a string',[[]],false],
						['Test that a function is not regarded as a string',function () {},false],
						['Test that a regular expression instance is not regarded as a string',/\d+/,false],
						['Test that a non-empty string value is regarded as a string','foo',true],
						['Test that an empty string value is regarded as a string','',true],
						['Test that a String object instance is not regarded as a string',new String ('foo'),false]
					]],
					['Uize.isBoolean',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a boolean',undefined,false],
						['Test that the value null is not regarded as a boolean',null,false],
						['Test that a string value is not regarded as a boolean','foo',false],
						['Test that an object is not regarded as a boolean',{},false],
						['Test that an array is not regarded as a boolean',[[]],false],
						['Test that a function is not regarded as a boolean',function () {},false],
						['Test that a regular expression instance is not regarded as a boolean',/\d+/,false],
						['Test that the boolean value false is regarded as a boolean',false,true],
						['Test that the boolean value true is regarded as a boolean',true,true],
						['Test that a Boolean object instance is not regarded as a boolean',new Boolean (true),false]
					]],
					['Uize.isFunction',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as a function',undefined,false],
						['Test that the value null is not regarded as a function',null,false],
						['Test that a string value is not regarded as a function','foo',false],
						['Test that a boolean value is not regarded as a function',true,false],
						['Test that a number value is not regarded as a function',42,false],
						['Test that an object is not regarded as a function',{},false],
						['Test that an array is not regarded as a function',[[]],false],
						['Test that a regular expression instance is not regarded as a function',/\d+/,false],
						['Test that a function *is* regarded as a function',function () {},true]
					]],
					['Uize.isNully',[
						['Test that calling with no parameters returns true',[],true],
						['Test that the value undefined is regarded as being nully',undefined,true],
						['Test that the value null is regarded as being nully',null,true],
						['Test that a string value is not regarded as being nully','',false],
						['Test that a boolean value is not regarded as being nully',false,false],
						['Test that a number value is not regarded as being nully',0,false],
						['Test that the special value NaN is not regarded as being nully',NaN,false],
						['Test that an object is not regarded as being nully',{},false],
						['Test that an array is not regarded as being nully',[[]],false],
						['Test that a function is not regarded as being nully',function () {},false],
						['Test that a regular expression instance is not regarded as being nully',/\d+/,false]
					]],
					['Uize.isObject',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being an object',undefined,false],
						['Test that the value null is not regarded as being an object',null,false],
						['Test that a string value is not regarded as being an object','foo',false],
						['Test that a boolean value is not regarded as being an object',true,false],
						['Test that a number value is not regarded as being an object',42,false],
						['Test that the special value NaN is not regarded as being an object',NaN,false],
						['Test that a function is not regarded as being an object',function () {},false],
						['Test that an object *is* regarded as being an object',{},true],
						['Test that an array is regarded as being an object',[[]],true],
						['Test that a regular expression instance is regarded as being an object',/\d+/,true],
						['Test that a String object instance is regarded as being an object',new String (''),true],
						['Test that a Boolean object instance is regarded as being an object',new Boolean (false),true],
						['Test that a Number object instance is regarded as being an object',new Number (0),true]
					]],
					['Uize.isPlainObject',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being a plain object',undefined,false],
						['Test that the value null is not regarded as being a plain object',null,false],
						['Test that a string value is not regarded as being a plain object','foo',false],
						['Test that a boolean value is not regarded as being a plain object',true,false],
						['Test that a number value is not regarded as being a plain object',42,false],
						['Test that the special value NaN is not regarded as being a plain object',NaN,false],
						['Test that a function is not regarded as being a plain object',function () {},false],
						['Test that a plain object *is* regarded as being a plain object',{},true],
						['Test that an array is not regarded as being a plain object',[[]],false],
						['Test that a regular expression instance is not regarded as being a plain object',/\d+/,false],
						['Test that a String object instance is not regarded as being a plain object',new String (''),false],
						['Test that a Boolean object instance is not regarded as being a plain object',new Boolean (false),false],
						['Test that a Number object instance is not regarded as being a plain object',new Number (0),false],
						['Test that a Uize class instance is not regarded as being a plain object',new Uize,false]
					]],
					['Uize.isPrimitive',[
						['Test that calling with no parameters returns false',[],false],
						['Test that the value undefined is not regarded as being an object',undefined,false],
						['Test that the value null is not regarded as being an object',null,false],
						['Test that a string value is regarded as being a primitive','',true],
						['Test that a boolean value is regarded as being a primitive',false,true],
						['Test that a number value is regarded as being a primitive',0,true],
						['Test that the special value NaN is regarded as being a primitive',NaN,true],
						['Test that a function is not regarded as being a primitive',function () {},false],
						['Test that an object is not regarded as being a primitive',{},false],
						['Test that an array is not regarded as being a primitive',[[]],false],
						['Test that a regular expression instance is not regarded as being a primitive',/\d+/,false],
						['Test that a String object instance is not regarded as being a primitive',new String ('foo'),false],
						['Test that a Boolean object instance is not regarded as being a primitive',new Boolean (true),false],
						['Test that a Number object instance is not regarded as being a primitive',new Number (42),false]
					]],
					['Uize.escapeRegExpLiteral',[
						['Test that all of the regular expression special characters are escaped correctly',
							'^$|{}[]()?.*+\\',
							'\\^\\$\\|\\{\\}\\[\\]\\(\\)\\?\\.\\*\\+\\\\'
						],
						['Test that characters that are not regular expression special characters are not escaped',
							'foobar,:;\'"~`<>/!@#%&_-=',
							'foobar,:;\'"~`<>/!@#%&_-='
						]
					]],
					['Uize.copyInto',
						[
							['Test that calling with only a target object and no source object results in the target object being returned unchanged',
								{foo:'bar',hello:'world'},
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value undefined for the source object results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},undefined],
								{foo:'bar',hello:'world'}
							],
							['Test that copying a source object into a target object works correctly',
								[{foo:'foo',hello:'there',otherInTarget:'blah'},{foo:'bar',hello:'world',otherInSource:'yawn'}],
								{foo:'bar',hello:'world',otherInTarget:'blah',otherInSource:'yawn'}
							],
							{
								title:'Test that the target object is returned and not a new object',
								test:function () {
									var _target = {foo:'bar'};
									var _result = Uize.copyInto (_target,{hello:'world'});
									return this.expectSameAs (_target,_result);
								}
							},
							['Test that an arbitrary number of source objects is supported',
								[
									{propFromTarget:'foo'},
									{propFromSource1:'bar'},
									{propFromSource2:'hello'},
									{propFromSource3:'world'}
								],
								{
									propFromTarget:'foo',
									propFromSource1:'bar',
									propFromSource2:'hello',
									propFromSource3:'world'
								}
							],
							['Test that the contents of source objects are copied into the target in the order in which the source objects are specified',
								[
									{foo:'foo',otherInTarget:'blah'},
									{foo:'bar',fancy:'pants'},
									{fancy:'schmancy',la:'dee dah'},
									{la:'dolce vita',fin:'ished'}
								],
								{foo:'bar',otherInTarget:'blah',fancy:'schmancy',la:'dolce vita',fin:'ished'}
							],
							['Test that specifying the value null or undefined for all of the source objects results in the target object being returned unchanged',
								[{foo:'bar',hello:'world'},null,undefined,undefined,null],
								{foo:'bar',hello:'world'}
							],
							['Test that specifying the value null for the target object results in the value null being returned',
								[null,{foo:'bar',hello:'world'}],
								null
							],
							['Test that specifying the value undefined for the target object results in the value null being returned',
								[undefined,{foo:'bar',hello:'world'}],
								undefined
							]
						],
						null,
						{cloneArguments:true}
					],
					['Uize.pairUp',[
						['Test that calling with no parameters returns {undefined:undefined}',[],{undefined:undefined}],
						['Test that undefined is the default for the valueANYTYPE parameter',['key'],{key:undefined}],
						['Test that the key can be a string','key',{key:undefined}],
						['Test that the key can be a number',5,{5:undefined}],
						['Test that the key can be the special value Infinity',Infinity,{Infinity:undefined}],
						['Test that the key can be the special value NaN',NaN,{NaN:undefined}],
						['Test that the key can be a boolean',false,{'false':undefined}],
						['Test that the key can be undefined',undefined,{undefined:undefined}],
						['Test that the key can be null',null,{'null':undefined}],
						['Test that the value can be a string',['key','value'],{key:'value'}],
						['Test that the value can be a number',['key',5],{key:5}],
						['Test that the value can be the special value Infinity',['key',Infinity],{key:Infinity}],
						['Test that the value can be the special value NaN',['key',NaN],{key:NaN}],
						['Test that the value can be a boolean',['key',false],{key:false}],
						['Test that the value can be undefined',['key',undefined],{key:undefined}],
						['Test that the value can be null',['key',null],{key:null}],
						['Test that the value can be an object',['key',{propName:'propValue'}],{key:{propName:'propValue'}}],
						['Test that an arbitrary number of arguments is supported',
							[
								'string','foo',
								'number',42,
								'boolean',false,
								'regexp',/\d+/,
								'undefined',undefined,
								'null',null,
								'NaN',NaN,
								'object',{},
								'array',[]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						],
						['Test that if there is only one argument whose value is an array, then that array is treated as the arguments list',
							[
								[
									'string','foo',
									'number',42,
									'boolean',false,
									'regexp',/\d+/,
									'undefined',undefined,
									'null',null,
									'NaN',NaN,
									'object',{},
									'array',[]
								]
							],
							{
								'string':'foo',
								'number':42,
								'boolean':false,
								'regexp':/\d+/,
								'undefined':undefined,
								'null':null,
								'NaN':NaN,
								'object':{},
								'array':[]
							}
						]
					]],
					['Uize.substituteInto',[
						['Test that calling with no parameters produces an empty string',
							[],
							''
						],
						['Test that calling with just a source string simply produces that string',
							'Hello, world!',
							'Hello, world!'
						],
						['Test that specifying the value null for substitutions produces the source string',
							['Hello, world!',null,'[#KEY]'],
							'Hello, world!'
						],
						['Test that specifying the value undefined for substitutions produces the source string',
							['Hello, world!',undefined,'[#KEY]'],
							'Hello, world!'
						],
						['Test that substituting into an empty string produces an empty string',
							['',{name:'Eric'},'[#KEY]'],
							''
						],
						['Test that substitution of a single token works correctly',
							['My name is [#name].',{name:'Eric'},'[#KEY]'],
							'My name is Eric.'
						],
						['Test that multiple substitutions are handled corretly',
							['My name is [#name], and I am a [#occupation].',{name:'Eric',occupation:'viking'},'[#KEY]'],
							'My name is Eric, and I am a viking.'
						],
						['Test that a custom token naming specifier is handled correctly',
							['My name is <%name%>, and I am a <%occupation%>.',{name:'Eric',occupation:'viking'},'<%KEY%>'],
							'My name is Eric, and I am a viking.'
						],
						['Test that token naming where token opener and closer are empty strings is handled correcly',
							['I am name, and I am a occupation.',{name:'Eric',occupation:'viking'},'KEY'],
							'I am Eric, and I am a viking.'
						],
						['Test that default for token naming is [#KEY]',
							['My name is [#name].',{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that specifying an empty object for substitutions simply produces the source string',
							['Hello, world!',{}],
							'Hello, world!'
						],
						['Test that the same substitution can be used multiple times',
							['My name is [#name]. [#name] is my name. You can call me [#name].',{name:'Eric'}],
							'My name is Eric. Eric is my name. You can call me Eric.'
						],
						['Test that substitution values that contain tokens are not further substituted into',
							['[#token1][#token2]',{token1:'[#token2]foo',token2:'bar'}],
							'[#token2]foobar'
						],
						['Test that tokens in the source string for which there aren\'t substitutions are left in the source string',
							['My name is [#name].',{occupation:'viking'}],
							'My name is [#name].'
						],
						['Test that substitutions for which there aren\'t tokens in the source string are ignored',
							['My name is [#name].',{name:'Eric',occupation:'viking'}],
							'My name is Eric.'
						],
						['Test that specifying an array for substitutions is handled correctly',
							['My name is [#0], and I am a [#1].',['Eric','viking']],
							'My name is Eric, and I am a viking.'
						],
						['Test that specifying an empty array for substitutions simply produces the source string',
							['Hello, world!',[]],
							'Hello, world!'
						],
						['Test that non-string substitution values are correctly coerced to strings',
							[
								'[#int] [#neg] [#float] [#nan] [#infinity] [#true] [#false] [#obj] [#null] [#undefined]',
								{
									int:5,neg:-5,float:5.5,nan:NaN,infinity:Infinity,
									'true':true,'false':false,
									obj:new _ClassWithValueInterface ({value:'OBJECT'}),
									'null':null,'undefined':undefined
								}
							],
							'5 -5 5.5 NaN Infinity true false OBJECT null undefined'
						],
						['Test that a string type substitution is treated as a substitutions array with one element',
							['My name is [#0].','Eric'],
							'My name is Eric.'
						],
						['Test that a number type substitution is treated as a substitutions array with one element',
							['Pi is approximately [#0].',3.14159265359],
							'Pi is approximately 3.14159265359.'
						],
						['Test that a boolean type substitution is treated as a substitutions array with one element',
							['It is not [#0] that the Earth is flat.',true],
							'It is not true that the Earth is flat.'
						],
						['Test that substitution keys are case-sensitive, as designed',
							['My name is [#name], and not [#NAME]!',{name:'Eric',NAME:'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that substitution keys are space-sensitive, as designed',
							['My name is [#name], and not [# name ]!',{name:'Eric',' name ':'Derrick'}],
							'My name is Eric, and not Derrick!'
						],
						['Test that spaces in the token opener and token closer are significant, as designed',
							['[name] [ name] [name ] [ name ]',{name:'Eric'},'[ KEY ]'],
							'[name] [ name] [name ] Eric'
						],
						['Test that a token opener containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\name].',{name:'Eric'},'[^$|{}[]()?.*+\\KEY]'],
							'My name is Eric.'
						],
						['Test that a token closer containing regular expression special characters is handled correctly',
							['My name is [name^$|{}[]()?.*+\\].',{name:'Eric'},'[KEY^$|{}[]()?.*+\\]'],
							'My name is Eric.'
						],
						['Test that a substitution key containing regular expression special characters is handled correctly',
							['My name is [^$|{}[]()?.*+\\].',{'^$|{}[]()?.*+\\':'Eric'},'[KEY]'],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be a number',
							[3.14159265359,{'.':','},'KEY'],
							'3,14159265359'
						],
						['Test that the source for substituting into can be a boolean',
							[true,{ru:'Russia'},'KEY'],
							'tRussiae'
						],
						['Test that the source for substituting into can be an object that implements a value interface',
							[new _ClassWithValueInterface ({value:'My name is [#name].'}),{name:'Eric'}],
							'My name is Eric.'
						],
						['Test that the source for substituting into can be an array, whose elements will be concatenated',
							[['[#name]','[#occupation]'],{name:'Eric',occupation:'viking'}],
							'Eric,viking'
						]
					]],
					['Uize.indexIn',[
						['Test that calling with no parameters produces the result -1',
							[],
							-1
						],
						['Test that specifying null for the sourceARRAY parameter produces the result -1',
							[null,null],
							-1
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result -1',
							[undefined,undefined],
							-1
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result -1',
							[5,5],
							-1
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result -1',
							['hello','hello'],
							-1
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result -1',
							[true,true],
							-1
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result -1',
							[[],1],
							-1
						],
						['Test that the fromEndBOOL and strictEqualityBOOL parameters are observed correctly',
							[[0,1,'1','1',1,2],'1',true,false],
							4
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1,'1','1',1,2],'1',true],
							3
						],
						['Test that the fromEndBOOL parameter is defaulted to false, as designed',
							[[0,1,'1','1',1,2],'1'],
							2
						],
						['Test that -1 is returned when the value is not found in the source array',
							[[0,1,'1','1',1,2],'0'],
							-1
						]
					]],
					['Uize.isIn',[
						['Test that calling with no parameters produces the result false',
							[],
							false
						],
						['Test that specifying null for the sourceARRAY parameter produces the result false',
							[null,null],
							false
						],
						['Test that specifying undefined for the sourceARRAY parameter produces the result false',
							[undefined,undefined],
							false
						],
						['Test that specifying a number for the sourceARRAY parameter produces the result false',
							[5,5],
							false
						],
						['Test that specifying a string for the sourceARRAY parameter produces the result false',
							['hello','hello'],
							false
						],
						['Test that specifying a boolean for the sourceARRAY parameter produces the result false',
							[true,true],
							false
						],
						['Test that specifying an empty array for the sourceARRAY parameter produces the result false',
							[[],1],
							false
						],
						['Test that the value false for the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',false],
							true
						],
						['Test that the value true for the strictEqualityBOOL parameter ia observed correctly',
							[[0,1],'1',true],
							false
						],
						['Test that the strictEqualityBOOL parameter is defaulted to true, as designed',
							[[0,1],'1'],
							false
						],
						['Test that false is returned when the value is not found in the source array',
							[[0,1],2],
							false
						],

						/*** test support for object source ***/
							['Test that true is returned when the source is an object, and the value is the value of one of the source object\'s properties',
								[{foo:'bar',hello:'world'},'bar'],
								true
							],
							['Test that false is returned when the source is an object, and the value is not one of the object\'s propertes\' values',
								[{foo:'bar',hello:'world'},'blah'],
								false
							],
							['Test that the value false for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',false],
								true
							],
							['Test that the value true for the strictEqualityBOOL parameter ia observed correctly when the source is an object',
								[{prop1:0,prop2:1},'1',true],
								false
							]
					]],
					['Uize.isEmpty',[
						['Test that empty object is considered empty',[{}],true],
						['Test that empty array is considered empty',[[]],true],
						['Test that empty string is considered empty',[''],true],
						['Test that String object initialized to empty string is considered empty',[new String ('')],true],
						['Test that the number zero is considered empty',[0],true],
						['Test that Number object initialized to zero is considered empty',[new Number (0)],true],
						['Test that the boolean false is considered empty',[false],true],
						['Test that Boolean object initialized to false is considered empty',[new Boolean (false)],true],
						['Test that null is considered empty',[null],true],
						['Test that undefined is considered empty',[undefined],true],
						['Test that NaN is considered empty',[NaN],true],
						['Test that class instance with empty value set-get property is considered empty',
							[new _ClassWithValueInterface ({value:0})],
							true
						],
						['Test that a non-empty object is not considered empty',[{blah:0}],false],
						['Test that a non-empty array is not considered empty',[['blah']],false],
						['Test that a non-empty string is not considered empty',['blah'],false],
						['Test that String object initialized to non-empty string is not considered empty',
							[new String ('foo')],
							false
						],
						['Test that a non-zero number is not considered empty',[1],false],
						['Test that Number object initialized to non-zero number is not considered empty',
							[new Number (1)],
							false
						],
						['Test that the boolean true is not considered empty',[true],false],
						['Test that Boolean object initialized to true is not considered empty',[new Boolean (true)],false],
						//['Test that a regular expression is not considered empty',[/^.+$/],false],
						['Test that a function (even an empty one) is not considered empty',function () {},false],
						['Test that class instance with non-empty value set-get property is not considered empty',
							[new _ClassWithValueInterface ({value:1})],
							false
						]
					]],
					['Uize.emptyOut',[
						{
							title:'Test that emptying out an already empty array produces that same empty array as the result',
							test:function () {
								var
									_source = [],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an already empty object produces that same empty object as the result',
							test:function () {
								var
									_source = {},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,_result);
							}
						},
						{
							title:'Test that emptying out an array with contents produces that same array with no contents as the result',
							test:function () {
								var
									_source = [1,2,3,4,5],
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,[]);
							}
						},
						{
							title:'Test that emptying out an object with contents produces that same object with no contents as the result',
							test:function () {
								var
									_source = {foo:1,bar:1},
									_result = Uize.emptyOut (_source)
								;
								return this.expect (true,_source == _result) && this.expect (_source,{});
							}
						},
						['Test that specifying the value null for the source produces the value null as the result',
							null,
							null
						],
						['Test that specifying the value undefined for the source produces the value undefined as the result',
							undefined,
							undefined
						]
					]],
					['Uize.recordMatches',[
						['Test that specifying the value null for the record produces the result false',
							[null,{foo:'bar'}],
							false
						],
						['Test that specifying the value undefined for the record produces the result false',
							[undefined,{foo:'bar'}],
							false
						],
						['Test that specifying the value null for the match object produces the result true',
							[{foo:'bar'},null],
							true
						],
						['Test that specifying the value undefined for the match object produces the result true',
							[{foo:'bar'},undefined],
							true
						],
						['Test that specifying an empty match object produces the result true',
							[{foo:'bar'},{}],
							true
						],
						['Test that specifying a match object that contains properties that aren\'t in the record produces the result false',
							[{foo:'bar'},{hello:'world'}],
							false
						],
						['Test that specifying a match object with a property that is in the record but whose value is not the same produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'dunno'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal but not in a strict equality produces the result false',
							[{meaningOfLife:42},{meaningOfLife:'42'}],
							false
						],
						['Test that specifying a match object with a property that is in the record and whose values is equal in a strict equality produces the result true',
							[{meaningOfLife:42},{meaningOfLife:42}],
							true
						],
						['Test that specifying a match object with multiple properties and that is only a partial match with the record produces the result false',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'there',meaningOfLife:42}],
							false
						],
						['Test that specifying a match object with multiple properties and that is a complete match with the record produces the result true',
							[{foo:'bar',hello:'world',meaningOfLife:42},{foo:'bar',hello:'world',meaningOfLife:42}],
							true
						],
						['Test that properties that are in the record but that are not in the match object are not considered and do not affect the success of the match',
							[{foo:'bar',hello:'world',meaningOfLife:42},{meaningOfLife:42}],
							true
						]
					]],
					['Uize.findRecordNo',[
						['Test that specifying null for the records results in the default number being returned',
							[null,{},5],
							5
						],
						['Test that specifying undefined for the records results in the default number being returned',
							[undefined,{},5],
							5
						],
						['Test that not specifying a default number results in the value -1 being used for default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'}],
							-1
						],
						['Test that specifying the value null for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},null],
							-1
						],
						['Test that specifying the value undefined for default number is treated as a default number of -1',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},undefined],
							-1
						],
						['Test that specifying a string value for detault number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},'5'],
							5
						],
						['Test that specifying a boolean value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},true],
							1
						],
						['Test that specifying an object value for the default number results in it being coerced to a number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},new _ClassWithValueInterface ({value:5})],
							5
						],
						['Test that specifying an object value for the default number that cannot be coerced to a number results in the value -1 being used for the default number',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'woo'},new _ClassWithValueInterface ({value:'blah'})],
							-1
						],
						['Test that the index of the first matching record is returned when the match matches a record',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],{foo:'bar'}],
							1
						],
						['Test that the value 0 is returned when the value null is specified for the match',
							[[{foo:'boo'},{foo:'bar'},{foo:'foo'}],null],
							0
						]
					]],
					['Uize.findRecord',[
						['Test that specifying null for the records results in the value null being returned',
							[null,{},5],
							null
						],
						['Test that specifying undefined for the records results in the value null being returned',
							[undefined,{},5],
							null
						],
						{
							title:'Test that the first matching record is returned when the match matches a record',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [1],Uize.findRecord (_records,{foo:'bar'}));
							}
						},
						{
							title:'Test that the first record is returned when the value null is specified for the match',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [0],Uize.findRecord (_records,null));
							}
						},
						{
							title:'Test that the record for the specified default record number is returned when no matching record is found',
							test:function () {
								var _records = [{foo:'boo'},{foo:'bar'},{foo:'foo'}];
								return this.expectSameAs (_records [2],Uize.findRecord (_records,{foo:'woo'},2));
							}
						}
					]],
					['Uize.getGuid',[
						{
							title:'Test that a string type value is returned, as expected',
							test:function () {return this.expectNonEmptyString (Uize.getGuid ())}
						},
						{
							title:'Test that result is different across ten successive calls',
							test:function () {
								var _callResults = [];
								for (var _callNo = -1; ++_callNo < 10;)
									_callResults.push (Uize.getGuid ())
								;
								return this.expectNoRepeats (_callResults);
							}
						}
					]],
					['Uize.getPathToLibrary',[
					]],
					['Uize.globalEval',[
					]],
					['Uize.isInstance',[
						['Test that calling with no parameters produces the result false',[],false],
						['Test that null is not regarded as a Uize subclass instance',null,false],
						['Test that undefined is not regarded as a Uize subclass instance',undefined,false],
						['Test that a string is not regarded as a Uize subclass instance','hello',false],
						['Test that a number is not regarded as a Uize subclass instance',5,false],
						['Test that a boolean is not regarded as a Uize subclass instance',true,false],
						['Test that a simple object is not regarded as a Uize subclass instance',{},false],
						['Test that an array is not regarded as a Uize subclass instance',[],false],
						['Test that a regular expression is not regarded as a Uize subclass instance',/\d+/,false],
						['Test that a function is not regarded as a Uize subclass instance',function () {},false],
						['Test that a Uize class is not regarded as a Uize subclass instance',Uize,false],
						['Test that a Uize package is not regarded as a Uize subclass instance',Uize.Data,false],
						['Test that a Uize instance is correctly regarded as a Uize subclass instance',new Uize,true]
					]],
					['Uize.clone',[
						/*** test cloning of null values ***/
							['Test that cloning the value null produces the value null',null,null],
							['Test that cloning the value undefined produces the value undefined',undefined,undefined],

						/*** test cloning of string valus ***/
							['Test that cloning an empty string produces an empty string','',''],
							['Test that cloning a non-empty string is handled correctly','solar','solar'],

						/*** test cloning of number values ***/
							['Test that cloning the value 0 produces the value 0',0,0],
							['Test that cloning a negative number is handled correctly',-1,-1],
							['Test that cloning a positive number is handled correctly',1,1],
							['Test that cloning the special number value NaN is handled correctly',NaN,NaN],
							['Test that cloning the special number value Infinity is handled correctly',Infinity,Infinity],
							['Test that cloning the special number value -Infinity is handled correctly',-Infinity,-Infinity],

						/*** test cloning of boolean values ***/
							['Test that cloning the boolean value false produces the value false',false,false],
							['Test that cloning the boolean value true produces the value true',true,true],

						/*** test cloning of instances of JavaScript's built-in objects ***/
							_cloneObjectTest (
								'Test that cloning an instance of the RegExp object is handled correctly',
								RegExp,
								new RegExp ('^\\s+$','gim')
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Date object is handled correctly',
								Date,
								'2001/9/11'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the String object is handled correctly',
								String,
								'solar'
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Number object is handled correctly',
								Number,
								42
							),
							_cloneObjectTest (
								'Test that cloning an instance of the Boolean object is handled correctly',
								Boolean,
								true
							),

						/*** test cloning of one level deep simple objects ***/
							['Test that cloning an empty object produces an empty object',{},{}],
							_cloneObjectTest (
								'Test that the clone of an object is not a reference to that object, but is a new object',
								Object,
								{}
							),
							['Test that cloning a non-empty object produces an identical copy of that object',
								_oneLevelDeepTestObjectForCloning,
								_oneLevelDeepTestObjectForCloning
							],

						/*** test cloning of one level deep arrays ***/
							['Test that cloning an empty array produces an empty array',[[]],[]],
							_cloneObjectTest (
								'Test that the clone of an array is not a reference to that array, but is a new array',
								Array,
								[]
							),
							['Test that cloning a non-empty array produces an identical copy of that array',
								[_oneLevelDeepTestArrayForCloning],
								_oneLevelDeepTestArrayForCloning
							],
							{
								title:'Test that cloning a non-empty array with custom properties preserves the custom properties in the clone',
								test:function () {
									var _arrayWithCustomProperties = [0,1,2];
									_arrayWithCustomProperties.foo = 'bar';
									return this.expect (_arrayWithCustomProperties,Uize.clone (_arrayWithCustomProperties));
								}
							},

						/*** test cloning of complex data structures ***/
							['Test that cloning a complex object data structure is handled correctly',
								[_complexObjectDataStructure],
								_complexObjectDataStructure
							],
							['Test that cloning a complex array data structure is handled correctly',
								[_complexArrayDataStructure],
								_complexArrayDataStructure
							],

						/*** test cloning of value types that should just be copied by reference ***/
							{
								title:'Test that cloning a function simply returns a reference to that function',
								test:function () {
									var _toClone = function () {};
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},
							{
								title:'Test that cloning a Uize class instance simply returns a reference to that instance',
								test:function () {
									var _toClone = new Uize;
									return this.expectSameAs (_toClone,Uize.clone (_toClone))
								}
							},

						/*** miscellaneous ***/
							['Test that specifying no parameter is equivalent to cloning the value undefined',
								[],
								undefined
							]
					]],
					['Uize.map',[
						['Test that function mapper gets element value as a parameter correctly',
							[['a','b','c'],function (_value) {return _value.toUpperCase ()}],
							['A','B','C']
						],
						['Test that function mapper gets element key as a parameter correctly',
							[['a','b','c'],function (_value,_key) {return _key}],
							[0,1,2]
						],
						['Test that function mapper is called as instance method on array correctly',
							[['a','b','c'],function () {return this.length}],
							[3,3,3]
						],
						['Test that number can be specified in place of a source array',
							[['a','b','c'],function (_value,_key) {return (_key + 1) + ' of ' + this.length + ' = ' + _value}],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a string can be used to specify a mapper',
							[['a','b','c'],'(key + 1) + \' of \' + this.length + \' = \' + value'],
							['1 of 3 = a','2 of 3 = b','3 of 3 = c']
						],
						['Test that a source object is automatically mapped to a object',
							[{a:0,b:1,c:2},'key + value'],
							{a:'a0',b:'b1',c:'c2'}
						],
						['Test that an empty array maps to an empty array',
							[[],'value'],
							[]
						],
						['Test that an empty object maps to an empty object',
							[{},'value'],
							{}
						],

						/*** test target parameter ***/
							['Test that map can be used to convert an array to an object by specifying an empty object target',
								[['a','b','c'],'value',{}],
								{0:'a',1:'b',2:'c'}
							],
							['Test that map can be used to convert an object to an array by specifying an empty array target',
								[{0:'a',1:'b',2:'c'},'value',[]],
								['a','b','c']
							],
							['Test that an empty array maps to an empty object, when an empty object target is specified',
								[[],'value',{}],
								{}
							],
							['Test that an empty object maps to an empty array, when an empty array target is specified',
								[{},'value',[]],
								[]
							]/*,
							_arrayMethodTargetTest (
								'Uize',
								'map',
								[1,2,3,4,5],
								[2,4,6,8,10],
								['value * 2',null,null],
								1,
								2
							)*/
					]],
					['Uize.forEach',[
						/*** test support for the source being an array ***/
							{
								title:'Test that, when the source is an empty array, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ([],function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach (['foo'],function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives the value of elements of the array as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],function (_value) {_seenValues.push (_value)});
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives the index of elements of the array as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler receives a reference to the source array as its third argument',
								test:function () {
									var
										_source = ['foo'],
										_seenSource
									;
									Uize.forEach (_source,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (_source,_seenSource);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called only for assigned elements of the source array when the optional allArrayElemnts parameter is not specified',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)});
									return this.expect (['foo','bar'],_seenElements);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called only for assigned elements of the source array when false is specified for the optional allArrayElemnts parameter',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)},false);
									return this.expect (['foo','bar'],_seenElements);
								}
							},
							{
								title:'Test that, when the source is an array, the iteration handler is called even for unassigned elements of the source array when true is specified for the optional allArrayElemnts parameter',
								test:function () {
									var
										_source = [],
										_seenElements = []
									;
									_source [1] = 'foo';
									_source [3] = 'bar';
									Uize.forEach (_source,function (_element) {_seenElements.push (_element)},0,true);
									return this.expect ([undefined,'foo',undefined,'bar'],_seenElements);
								}
							},

						/*** test support for the source being an object ***/
							{
								title:'Test that, when the source is an empty object, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach ({},function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach ({foo:'bar'},function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives the value of properties of the object as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value) {_seenValues.push (_value)});
									return this.expect (['bar','world'],_seenValues);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives the name of properties of the object as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach ({foo:'bar',hello:'world'},function (_value,_key) {_seenKeys.push (_key)});
									return this.expect (['foo','hello'],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is an object, the iteration handler receives a reference to the source object as its third argument',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenSource
									;
									Uize.forEach (_source,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (_source,_seenSource);
								}
							},
							{
								title:'Test that, when the source is an object, specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										_source,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										false
									);
									return (
										this.expect ('bar',_seenValue) &&
										this.expect ('foo',_seenKey) &&
										this.expectSameAs (_source,_seenSource)
									);
								}
							},
							{
								title:'Test that, when the source is an object, specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_source = {foo:'bar'},
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										_source,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										true
									);
									return (
										this.expect ('bar',_seenValue) &&
										this.expect ('foo',_seenKey) &&
										this.expectSameAs (_source,_seenSource)
									);
								}
							},

						/*** test support for source being a length ***/
							{
								title:'Test that, when the source is the number zero, the iterator is never called',
								test:function () {
									var _iteratorCalled = false;
									Uize.forEach (0,function () {_iteratorCalled = true});
									return this.expect (false,_iteratorCalled);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var
										_context = {},
										_seenContext
									;
									Uize.forEach (1,function () {_seenContext = this},_context);
									return this.expectSameAs (_context,_seenContext);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (10,function (_value) {_seenValues.push (_value)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenValues);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (10,function (_value,_key) {_seenKeys.push (_key)});
									return this.expect ([0,1,2,3,4,5,6,7,8,9],_seenKeys);
								}
							},
							{
								title:'Test that, when the source is a number, the iteration handler receives the source as its third argument',
								test:function () {
									var _seenSource;
									Uize.forEach (10,function (_value,_key,_source) {_seenSource = _source});
									return this.expectSameAs (10,_seenSource);
								}
							},
							{
								title:'Test that, when the source is a number, specifying false for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										1,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										false
									);
									return (
										this.expect (0,_seenValue) &&
										this.expect (0,_seenKey) &&
										this.expectSameAs (1,_seenSource)
									);
								}
							},
							{
								title:'Test that, when the source is a number, specifying true for the optional allArrayElemnts parameter doesn\'t cause the method to fail',
								test:function () {
									var
										_seenValue,
										_seenKey,
										_seenSource
									;
									Uize.forEach (
										1,
										function (_value,_key,_source) {
											_seenValue = _value;
											_seenKey = _key;
											_seenSource = _source;
										},
										true
									);
									return (
										this.expect (0,_seenValue) &&
										this.expect (0,_seenKey) &&
										this.expectSameAs (1,_seenSource)
									);
								}
							},

						/*** test support for string iteration handler ***/
							{
								title:'Test that, when the iteration handler is a string, the iteration handler is called as a method on the optionally specified context',
								test:function () {
									var _context = {};
									Uize.forEach (1,'this.foo = "bar"',_context);
									return this.expect ({foo:'bar'},_context);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the iteration index as its first argument',
								test:function () {
									var _seenValues = [];
									Uize.forEach (['foo','bar'],'this.push (value)',_seenValues);
									return this.expect (['foo','bar'],_seenValues);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the iteration index as its second argument',
								test:function () {
									var _seenKeys = [];
									Uize.forEach (['foo','bar'],'this.push (key)',_seenKeys);
									return this.expect ([0,1],_seenKeys);
								}
							},
							{
								title:'Test that, when the iteration handler is a string, the iteration handler receives the source as its third argument',
								test:function () {
									var
										_source = {foo:'bar'},
										_context = {}
									;
									Uize.forEach (_source,'source [key] = value.toUpperCase ()',_context);
									return this.expect ({foo:'BAR'},_source);
								}
							},

						/*** test handling of a non-object source ***/
							{
								title:'Test that, when the source is neither an array, object, nor length, the iterator is never called',
								test:function () {
									var _timesIteratorCalled = 0;
									function _iterator () {_timesIteratorCalled++}

									Uize.forEach (undefined,_iterator);
									Uize.forEach (null,_iterator);
									Uize.forEach (true,_iterator);
									Uize.forEach (NaN,_iterator);
									Uize.forEach ('foo',_iterator);

									return this.expect (0,_timesIteratorCalled);
								}
							}
					]],
					['Uize.callOn',[
						{
							title:'Test that specifying null for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (null,function () {_success = false});
								return _success;
							}
						},
						{
							title:'Test that specifying undefined for the object results in no action',
							test:function () {
								var _success = true;
								Uize.callOn (undefined,function () {_success = false});
								return _success;
							}
						},
						{
							title:
								'Test that specifying a value for method that is neither a string nor a function results in no error being produced',
							test:function () {
								var _target = new Uize;
								Uize.callOn (_target);
								Uize.callOn (_target,null);
								Uize.callOn (_target,undefined);
								Uize.callOn (_target,42);
								Uize.callOn (_target,true);
								Uize.callOn (_target,{});
								Uize.callOn (_target,[]);
								return true;
							}
						},
						{
							title:
								'Test that specifying a function as the method and an instance as the target results in the function being called as an instance method on the instance',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								Uize.callOn (_target,function () {_success = this == _target});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is not specified, the arguments are defaulted to an empty array',
							test:function () {
								var
									_target = new Uize,
									_success = false
								;
								Uize.callOn (_target,function () {_success = arguments.length == 0});
								return _success;
							}
						},
						{
							title:
								'Test that when the optional arguments parameter is specified, those arguments are passed in the call correctly',
							test:function () {
								var
									_target = new Uize,
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								Uize.callOn (
									_target,
									function () {_actualArguments = _copyArguments (arguments)},
									_expectedArguments
								);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string does not result in an error being produced when the method is not defined on the instance',
							test:function () {
								var
									_target = new Uize,
									_bogusMethodName = 'SOME-BOGUS-METHOD-NAME'
								;
								delete _target [_bogusMethodName];
								Uize.callOn (_target,_bogusMethodName);
								return true;
							}
						},
						{
							title:
								'Test that specifying the target as an instance and the method as a string results in the specified method being called as an instance method on the instance',
							test:function () {
								var
									_target = new Uize,
									_success = false,
									_expectedArguments = ['foo',42,true],
									_actualArguments
								;
								_target.someSillyMethodName = function () {_actualArguments = _copyArguments (arguments)};
								Uize.callOn (_target,'someSillyMethodName',_expectedArguments);
								return this.expect (_expectedArguments,_actualArguments);
							}
						},
						{
							title:
								'Test that specifying an array as the target results in the method being called correctly on all elements of the array',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = [_subTarget0,_subTarget1,_subTarget2]
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:_copyArguments (arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:
								'Test that specifying an object as the target results in the method being called correctly on all property values of the object',
							test:function () {
								var
									_callLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTarget0 = new _DummyClass ({name:'subTarget0'}),
									_subTarget1 = new _DummyClass ({name:'subTarget1'}),
									_subTarget2 = new _DummyClass ({name:'subTarget2'}),
									_target = {foo:_subTarget0,bar:_subTarget1,helloworld:_subTarget2}
								;
								Uize.callOn (
									_target,
									function () {
										_callLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (
									[
										{_name:'subTarget0',_arguments:_testArguments},
										{_name:'subTarget1',_arguments:_testArguments},
										{_name:'subTarget2',_arguments:_testArguments}
									],
									_callLog
								);
							}
						},
						{
							title:'Test that recursion is handled correctly when the target is a complex data structure',
							test:function () {
								var
									_expectedCallLog = [],
									_actualCallLog = [],
									_DummyClass = Uize.subclass (),
									_testArguments = ['foo',42,true],
									_subTargetNo = -1
								;
								function _getNextSubTarget () {
									var _subTargetName = 'subTarget' + ++_subTargetNo;
									_expectedCallLog.push ({
										_name:_subTargetName,
										_arguments:_testArguments
									});
									return new _DummyClass ({name:_subTargetName});
								}
								var _target = {
									foo:_getNextSubTarget (),
									bar:[ // array nested in an object
										_getNextSubTarget (),
										{ // object nested in an array
											hello:_getNextSubTarget (),
											there:{ // object nested in an object
												silly:_getNextSubTarget (),
												sausage:_getNextSubTarget ()
											},
											world:_getNextSubTarget ()
										},
										[ // array nested in an array
											_getNextSubTarget (),
											_getNextSubTarget ()
										]
									],
									blah:_getNextSubTarget ()
								};
								Uize.callOn (
									_target,
									function () {
										_actualCallLog.push ({
											_name:this.get ('name'),
											_arguments:[].concat.apply ([],arguments)
										});
									},
									_testArguments
								);
								return this.expect (_expectedCallLog,_actualCallLog);
							}
						},
						{
							title:'Test that a function can be called as a method on values that are primitives or instances of objects that are not Uize subclasses',
							test:function () {
								var
									_values = [true,42,'foo',NaN,new Date ('01/01/2011'),/\d+/],
									_valuesCoercedToString = [],
									_valuesSeenByFunctionCoercedToString = []
								;
								for (var _valueNo = -1, _valuesLength = _values.length; ++_valueNo < _valuesLength;)
									_valuesCoercedToString.push (_values [_valueNo] + '')
								;
								Uize.callOn (_values,function () {_valuesSeenByFunctionCoercedToString.push (this + '')});
								return this.expect (_valuesCoercedToString,_valuesSeenByFunctionCoercedToString);
							}
						}
					]],
					['Uize.keys',[
						['Test that an object\'s keys are reported correctly',[{foo:1,bar:2}],['foo','bar']],
						['Test that a populated array\'s keys are reported correctly',[['a','b','c','d']],['0','1','2','3']],
						['Test that a sparsely populated array\'s keys are reported correctly',
							[_sparselyPopulatedArray],
							['2','7']
						],
						['Test that a non-zero length array that is unpopulated has no keys',[new Array (5)],[]],
						['Test that an empty array has no keys',[[]],[]],
						['Test that an empty object has no keys',[{}],[]],
						['Test that null has no keys',null,[]],
						['Test that undefined has no keys',undefined,[]],
						['Test that a boolean value has no keys',false,[]],
						['Test that a number value has no keys',5,[]],
						['Test that a string value has no keys','hello',[]]
					]],
					['Uize.totalKeys',[
						['Test that an object\'s total keys are reported correctly',[{foo:1,bar:2}],2],
						['Test that a populated array\'s total keys are reported correctly',[['a','b','c','d']],4],
						['Test that a sparsely populated array\'s total keys are reported correctly',
							[_sparselyPopulatedArray],
							2
						],
						['Test that a non-zero length array that is unpopulated has 0 keys',[new Array (5)],0],
						['Test that an empty array has 0 keys',[[]],0],
						['Test that an empty object has 0 keys',[{}],0],
						['Test that null has 0 keys',null,0],
						['Test that undefined has 0 keys',undefined,0],
						['Test that a boolean value has 0 keys',false,0],
						['Test that a number value has 0 keys',5,0],
						['Test that a string value has 0 keys','hello',0]
					]],
					['Uize.values',[
						['Test that an object\'s values are reported correctly',[{foo:1,bar:2}],[1,2]],
						['Test that a populated array\'s values are reported correctly',
							[['a','b','c','d']],
							['a','b','c','d']
						],
						{
							title:'Test that getting values for an array simply returns the array',
							test:function () {return Uize.values (_sparselyPopulatedArray) == _sparselyPopulatedArray}
						},
						['Test that a sparsely populated array\'s values are reported correctly',
							[_sparselyPopulatedArray],
							_sparselyPopulatedArray
						],
						['Test that a non-zero length array that is unpopulated has no values',
							[new Array (5)],
							new Array (5)
						],
						['Test that an empty array has no values',[[]],[]],
						['Test that an empty object has no values',[{}],[]],
						['Test that null has no values',null,[]],
						['Test that undefined has no values',undefined,[]],
						['Test that a boolean value has no values',false,[]],
						['Test that a number value has no values',5,[]],
						['Test that a string value has no values','hello',[]]
					]],
					['Uize.lookup',[
						['Test that true is the default value for the lookupValue paramter',
							[['foo','bar']],
							{foo:true,bar:true}
						],
						['Test that default can be specified as a value for the lookupValue paramter',
							[['foo','bar'],undefined],
							{foo:undefined,bar:undefined}
						],
						['Test that a values array with duplicate values is handled correctly',
							[['foo','foo','bar','bar']],
							{foo:true,bar:true}
						],
						['Test that a values array with different types of values is handled correctly',
							[['','string',true,4.01,NaN,Infinity,null,undefined],1],
							{'':1,'string':1,'true':1,'4.01':1,'NaN':1,'Infinity':1,'null':1,'undefined':1}
						],
						['Test that an empty values array produces an empty lookup object',
							[[]],
							{}
						],
						['Test that a sparsely populated values array produces a lookup object with a single "undefined" key for all the missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:true,2:true,'undefined':true}
						],
						['Test that a non-zero length values array that is unpopulated produces a lookup object with a single "undefined" key for all the undefined element values',
							[new Array (5)],
							{'undefined':true}
						]
					]],
					['Uize.reverseLookup',[
						['Test that calling with no parameter produces an empty object',
							[],
							{}
						],
						['Test that calling with the value null specified produces an empty object',
							[null],
							{}
						],
						['Test that calling with the value undefined specified produces an empty object',
							[undefined],
							{}
						],
						['Test that an object with no duplicate values is handled correctly',
							[{foo:1,bar:2}],
							{1:'foo',2:'bar'}
						],
						['Test that an object with duplicate values is handled as expected (last mapping wins)',
							[{foo:1,bar:1}],
							{1:'bar'}
						],
						['Test that an empty object produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that an object with different types of values is handled correctly',
							[{prop1:'',prop2:'string',prop3:true,prop4:4.01,prop5:NaN,prop6:Infinity,prop7:null,prop8:undefined}],
							{'':'prop1','string':'prop2','true':'prop3','4.01':'prop4','NaN':'prop5',Infinity:'prop6','null':'prop7','undefined':'prop8'}
						],
						['Test that an array can be specified as a source object',
							[['foo','bar']],
							{foo:'0',bar:'1'}
						],
						['Test that an empty array produces an empty reverse lookup object',
							[{}],
							{}
						],
						['Test that a sparsely populated values array produces a reverse lookup object with no "undefined" key for missing/undefined element values',
							[_sparselyPopulatedArray],
							{1:'2',2:'7'}
						],
						['Test that a non-zero length values array that is unpopulated produces an empty reverse lookup object',
							[new Array (5)],
							{}
						],
						['Test that null produces an empty reverse lookup object',null,{}],
						['Test that undefined produces an empty reverse lookup object',undefined,{}],
						['Test that a boolean value produces an empty reverse lookup object',false,{}],
						['Test that a number value produces an empty reverse lookup object',5,{}],
						['Test that a string value produces an empty reverse lookup object','hello',{}]
					]],
					['Uize.max',[
						['Test that the maximum value from an object is reported correctly',[{foo:1,bar:2}],2],
						['Test that the maximum value from an array is reported correctly',[[1,2]],2],
						['Test that the maximum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the maximum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the maximum value from an empty array is -Infinity',[[]],-Infinity],
						['Test that the maximum value from an empty object is -Infinity',[{}],-Infinity],
						['Test that the maximum value from null is -Infinity',null,-Infinity],
						['Test that the maximum value from undefined is -Infinity',undefined,-Infinity],
						['Test that the maximum value from a boolean value is -Infinity',false,-Infinity],
						['Test that the maximum value from a number value is -Infinity',5,-Infinity],
						['Test that the maximum value from a string value is -Infinity','hello',-Infinity]
					]],
					['Uize.min',[
						['Test that the minimum value from an object is reported correctly',[{foo:1,bar:2}],1],
						['Test that the minimum value from an array is reported correctly',[[1,2]],1],
						['Test that the minimum value from a sparsely populated array is NaN',
							[_sparselyPopulatedArray],
							NaN
						],
						['Test that the minimum value from a non-zero length array that is unpopulated is NaN',
							[new Array (5)],
							NaN
						],
						['Test that the minimum value from an empty array is Infinity',[[]],Infinity],
						['Test that the minimum value from an empty object is Infinity',[{}],Infinity],
						['Test that the minimum value from null is Infinity',null,Infinity],
						['Test that the minimum value from undefined is Infinity',undefined,Infinity],
						['Test that the minimum value from a boolean value is Infinity',false,Infinity],
						['Test that the minimum value from a number value is Infinity',5,Infinity],
						['Test that the minimum value from a string value is Infinity','hello',Infinity]
					]],

					['Uize.fire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.wire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.unwire',[
						// NOTE: this method is thoroughly tested by the event system tests (so, no more tests here)
					]],
					['Uize.registerProperties',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.get',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.set',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.toggle',[
						// NOTE: this method is thoroughly tested by the properties system tests (so, no more tests here)
					]],
					['Uize.toString',[
					]],
					['Uize.valueOf',[
						{
							title:
								'Test that the valueOf method of a class returns the value of the special value set-get property for the class (ie. the initial value for the value set-get property)',
							test:function () {
								var _Subclass = Uize.subclass ();
								_Subclass.registerProperties ({
									_value:{
										name:'value',
										value:'foo'
									}
								});
								return this.expect (_Subclass.valueOf (),'foo');
							}
						},
						{
							title:
								'Test that the valueOf method of an instance returns the value of the special value set-get property for the instance',
							test:function () {
								var _Subclass = Uize.subclass ();
								_Subclass.registerProperties ({
									_value:{
										name:'value',
										value:'foo'
									}
								});
								var _instance = new _Subclass;
								return this.expect (_instance.valueOf (),'foo');
							}
						}
					]],
					['Uize.module',[
					]],
					['Uize.subclass',[
						/*
							- test set-get properties and inheritance
								- test that set-get properties are inherited by subclasses
						*/
					]]
				]),
				{
					title:'Test the event system for instances and classes',
					test:[
						_eventsSystemTest ('Test that the event system works for instances',true),
						_eventsSystemTest ('Test that the event system works for classes',false)
					]
				},
				{
					title:'Test the set-get properties system',
					test:[
						{
							title:'Test registering set-get properties',
							test:[
								{
									title:'Test that a set-get property can be registered using the minimal profile syntax',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({_myProperty:'myProperty'});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:'Test that a set-get property can be registered using the complete profile syntax',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({_myProperty:{name:'myProperty'}});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that multiple properties can be registered in a single call to the registerProperty method, and that minimal and complete profiles can be combined',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1',
											_myProperty2:{name:'myProperty2'}
										});
										var _instance = new _Subclass;
										return this.expect ({myProperty1:undefined,myProperty2:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that the public name of a set-get property is defaulted when no value is specified for the name property in the property profile',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;
										return this.expect ({myProperty:undefined},_instance.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by specifying values for unregistered properties when calling the constructor',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_instance1 = new _Subclass ({foo:'bar'}),
											_instance2 = new _Subclass
										;
										return this.expect ({foo:undefined},_instance2.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by setting values for unregistered properties using the set instance method',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_instance1 = new _Subclass
										;
										_instance1.set ({foo:'bar'});
										var _instance2 = new _Subclass;
										return this.expect ({foo:undefined},_instance2.get ());
									}
								},
								{
									title:
										'Test that set-get properties can be registered in an ad hoc fashion, by setting values for unregistered properties using the set static method',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.set ({foo:'bar'});
										var _instance = new _Subclass;
										return this.expect ({foo:'bar'},_instance.get ());
									}
								},
								{
									title:
										'Test that multiple set-get properties can be registered cumulatively by calling registerProperties repeatedly',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({_myProperty1:'myProperty1'});
										_Subclass.registerProperties ({_myProperty2:{name:'myProperty2'}});
										var _instance = new _Subclass;
										return this.expect ({myProperty1:undefined,myProperty2:undefined},_instance.get ());
									}
								}
							]
						},
						{
							title:'Test setting values for set-get properties for instances and classes',
							test:[
								_setMethodTest ('Test that the set method works for instances',true),
								_setMethodTest ('Test that the set method works for classes',false)
							]
						},
						{
							title:'Test getting values for set-get properties for instances and classes',
							test:[
								_getMethodTest ('Test that the get method works for instances',true),
								_getMethodTest ('Test that the get method works for classes',false)
							]
						},
						{
							title:'Test the initial value facility',
							test:[
								{
									title:
										'Test that when no initial value is specified for a set-get property, the property\'s initial value is undefined',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{}
										});
										var _instance = new _Subclass;
										return this.expect (undefined,_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that specifying a value property in a set-get property\'s profile when registering it has the effect of setting the initial value for that property for new instances that are created',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that null is supported as an initial value for a set-get property and that it is not treated the same as undefined',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:null}
										});
										var _instance = new _Subclass;
										return this.expect (null,_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that the initial value registered for a property is returned as the result when querying the value of that set-get property on the class',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										return this.expect ('initial value',_Subclass.get ('myProperty'));
									}
								},
								{
									title:
										'Test that setting the value for a set-get property on the class has the effect of setting the initial value for the property',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{}
										});
										_Subclass.set ({myProperty:'initial value'});
										var _instance = new _Subclass;
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that setting the value for a set-get property on the class does not affect the value of the property for instances that have already been created',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_Subclass.set ({myProperty:'new initial value'});
										return this.expect ('initial value',_instance.get ('myProperty'));
									}
								}
							]
						},
						{
							title:'Test the onChange handlers mechanism',
							test:[
								{
									title:
										'Test that an onChange handler for a set-get property is executed on the very first change of the value of that property that occurs during construction of the instance',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCount++}
											}
										});
										var _instance = new _Subclass;
										return this.expect (1,_onChangeHandlerCount);
									}
								},
								{
									title:
										'Test that an onChange handler for a set-get property is only executed once upon construction when a value specified for the property in the constructor differs from the property\'s initial value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCount++}
											}
										});
										var _instance = new _Subclass ({myProperty:'new value'});
										return this.expect (1,_onChangeHandlerCount);
									}
								},
								{
									title:
										'Test that an onChange handler is only executed when the value of a set-get property has actually changed as a result of a set - not on non-changing sets',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeCount++}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'initial value'});
										_instance.set ({myProperty:'new value'});
										_instance.set ({myProperty:'new value'});
										return this.expect (2,_onChangeCount);
									}
								},
								{
									title:
										'Test that an onChange handler is called as a method on the instance that owns the set-get property',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_contextForCallingOnChange
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_contextForCallingOnChange = this}
											}
										});
										var _instance = new _Subclass;
										return this.expect (_instance,_contextForCallingOnChange);
									}
								},
								{
									title:
										'Test that the value of the set-get property has already changed by the time that an onChange handler is called',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_valueOfPropertyWhenOnChangeCalled
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {
													_valueOfPropertyWhenOnChangeCalled = this.get ('myProperty');
												}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'new value'});
										return this.expect ('new value',_valueOfPropertyWhenOnChangeCalled);
									}
								},
								{
									title:
										'Test that an onChange handler can be specified by a string, where that string specifies the name of a method that must be defined for the instance',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeCount = 0
										;
										_Subclass.prototype.someMethod = function () {_onChangeCount++};
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:'someMethod'
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:'new value'});
										return this.expect (2,_onChangeCount);
									}
								},
								{
									title:
										'Test that an array of multiple onChange handlers can be specified for a set-get property, and that all of them are executed, in the order in which they appear in the array',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:[
													function () {_coverageAndOrder.push ('onChangeHandler1')},
													function () {_coverageAndOrder.push ('onChangeHandler2')},
													function () {_coverageAndOrder.push ('onChangeHandler3')}
												]
											}
										});
										var _instance = new _Subclass;
										return this.expect (
											'onChangeHandler1,onChangeHandler2,onChangeHandler3',
											_coverageAndOrder + ''
										);
									}
								},
								{
									title:
										'Test that an array of multiple onChange handlers may contain a mix of handlers specified by function reference, handlers specified by method name, and nested lists of handlers',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.prototype.someMethod1 = function () {
											_coverageAndOrder.push ('onChangeHandlerSpecifiedByString1');
										};
										_Subclass.prototype.someMethod2 = function () {
											_coverageAndOrder.push ('onChangeHandlerSpecifiedByString2');
										};
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:[
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction1')},
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction2')},
													function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction3')},
													'someMethod1',
													[
														function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction4')},
														'someMethod2',
														function () {_coverageAndOrder.push ('onChangeSpecifiedByFunction5')}
													]
												]
											}
										});
										var _instance = new _Subclass;
										return this.expect (
											[
												'onChangeSpecifiedByFunction1',
												'onChangeSpecifiedByFunction2',
												'onChangeSpecifiedByFunction3',
												'onChangeHandlerSpecifiedByString1',
												'onChangeSpecifiedByFunction4',
												'onChangeHandlerSpecifiedByString2',
												'onChangeSpecifiedByFunction5'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that all onChange handlers receive a single argument when it is called, which is an object containing the conformed values for all properties being set (not just those that have changed value)',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_argumentsForBarOnChangeHandler,
											_argumentsForMyPropertyOnChangeHandler1,
											_argumentsForMyPropertyOnChangeHandler2,
											_propertiesBeingSet = {
												foo:'the value of foo',
												bar:'the new value of bar',
												myProperty:'new value'
											}
										;
										_Subclass.registerProperties ({
											foo:{
												value:'the value of foo'
											},
											bar:{
												value:'the value of bar',
												onChange:function () {
													_argumentsForBarOnChangeHandler = _copyArguments (arguments);
												}
											},
											helloWorld:{
												value:'Hello, world!'
											},
											myProperty:{
												value:'initial value',
												onChange:[
													function () {
														_argumentsForMyPropertyOnChangeHandler1 = _copyArguments (arguments);
													},
													function () {
														_argumentsForMyPropertyOnChangeHandler2 = _copyArguments (arguments);
													}
												]
											}
										});
										var _instance = new _Subclass;
										_instance.set (_propertiesBeingSet);
										return (
											this.expect ([_propertiesBeingSet],_argumentsForBarOnChangeHandler) &&
											this.expect ([_propertiesBeingSet],_argumentsForMyPropertyOnChangeHandler1) &&
											this.expect ([_propertiesBeingSet],_argumentsForMyPropertyOnChangeHandler2)
										);
									}
								},
								{
									title:
										'Test that onChange handlers are called for all set-get properties that have changed value in the course of the same set call',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeHandlerCountForBar,
											_onChangeHandlerCountForHelloWorld,
											_onChangeHandlerCountForMyProperty,
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											foo:{
												value:'the value of foo'
											},
											bar:{
												value:'the value of bar',
												onChange:function () {_onChangeHandlerCountForBar++}
											},
											helloWorld:{
												value:'Hello, world!',
												onChange:function () {_onChangeHandlerCountForHelloWorld++}
											},
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeHandlerCountForMyProperty++}
											}
										});
										var _instance = new _Subclass;
										_onChangeHandlerCountForBar = _onChangeHandlerCountForHelloWorld = _onChangeHandlerCountForMyProperty = 0;
										_instance.set ({
											foo:'new value of foo',
											bar:'the new value of bar',
											helloWorld:'Hello, world!',
											myProperty:'new value of myProperty'
										});
										return (
											this.expect (1,_onChangeHandlerCountForBar) &&
											this.expect (0,_onChangeHandlerCountForHelloWorld) &&
											this.expect (1,_onChangeHandlerCountForMyProperty)
										);
									}
								},
								{
									title:
										'Test that an onChange handler is not called for any instances of a class when the value of the set-get property is set on the class',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{
												value:'initial value',
												onChange:function () {_onChangeCount++}
											}
										});
										var
											_instance1 = new _Subclass,
											_instance2 = new _Subclass,
											_instance3 = new _Subclass,
											_onChangeCountAfterCreatingInstances = _onChangeCount;
										;
										_onChangeCount = 0;
										_Subclass.set ({myProperty:'new initial value'});
										return (
											this.expect (3,_onChangeCountAfterCreatingInstances) &&
											this.expect (0,_onChangeCount)
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s onChange handler is only called for an instance of the class whose value for the property has changed (ie. no contamination across instances)',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											name:{},
											myProperty:{
												value:'initial value',
												onChange:function () {_coverageAndOrder.push (this.get ('name'))}
											}
										});
										var
											_instance1 = new _Subclass ({name:'instance1'}),
											_instance2 = new _Subclass ({name:'instance2'}),
											_instance3 = new _Subclass ({name:'instance3'})
										;
										_coverageAndOrder = [];
										_instance2.set ({myProperty:'new value'});
										return this.expect (['instance2'],_coverageAndOrder);
									}
								},
								{
									title:
										'Test that an onChange handler is only executed if the value of a set-get property has changed after being conformed, and not just if the pre-conformed value is different from the current value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_valuesWhenOnChangeCalled = []
										;
										_Subclass.registerProperties ({
											name:{},
											myProperty:{
												value:0,
												conformer:function (_value) {
													return Math.max (Math.min (_value,100),0);
												},
												onChange:function () {
													_valuesWhenOnChangeCalled.push (this.get ('myProperty'));
												}
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:-10});
										_instance.set ({myProperty:10});
										_instance.set ({myProperty:10});
										_instance.set ({myProperty:100});
										_instance.set ({myProperty:200});
										_instance.set ({myProperty:-200});
										_instance.set ({myProperty:0});
										return this.expect ([0,10,100,0],_valuesWhenOnChangeCalled);
									}
								},
								{
									title:
										'Test that when the same onChange handler is registered for multiple set-get properties, it is only executed once - even if the values of all those properties change during a set',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeHandlerSpecifiedByStringCount = 0,
											_onChangeHandlerSpecifiedByFunctionCount = 0
										;
										_Subclass.prototype.someMethod = function () {_onChangeHandlerSpecifiedByStringCount++};
										function _onChangeHandlerFunction () {_onChangeHandlerSpecifiedByFunctionCount++};
										_Subclass.registerProperties ({
											myProperty1:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											},
											myProperty2:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											},
											myProperty3:{
												value:'initial value',
												onChange:[
													'someMethod',
													_onChangeHandlerFunction
												]
											}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1:'new value',
											myProperty2:'new value',
											myProperty3:'new value'
										});
										return (
											this.expect (2,_onChangeHandlerSpecifiedByStringCount) &&
											this.expect (2,_onChangeHandlerSpecifiedByFunctionCount)
										);
									}
								},
								{
									title:
										'Test that the execute-once optimization for onChange handlers shared across properties does not prevent an onChange handler from executing on subsequent sets (ie. cleanup occurs correctly)',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_onChangeHandlerCount = 0,
											_myProperty1NewValue = 0,
											_myProperty2NewValue = 0,
											_myProperty3NewValue = 0
										;
										function _onChangeHandlerFunction () {_onChangeHandlerCount++};
										_Subclass.registerProperties ({
											myProperty1:{onChange:_onChangeHandlerFunction},
											myProperty2:{onChange:_onChangeHandlerFunction},
											myProperty3:{onChange:_onChangeHandlerFunction}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1:++_myProperty1NewValue,
											myProperty2:++_myProperty2NewValue,
											myProperty3:++_myProperty3NewValue
										});
										_instance.set ({myProperty1:++_myProperty1NewValue});
										_instance.set ({myProperty2:++_myProperty2NewValue});
										_instance.set ({myProperty3:++_myProperty3NewValue});
										return this.expect (4,_onChangeHandlerCount);
									}
								}
							]
						},
						{
							title:'Test the conformer mechanism',
							test:[
								{
									title:
										'Test that a set-get property\'s conformer function is called as an instance method on the instance for which the property values are being set',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_contextForConformerCall
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function () {_contextForConformerCall = this},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expectSameAs (_instance,_contextForConformerCall);
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is called with two arguments, where the first argument is the new value being set for the property, and the second argument is the current value of the property',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_expectedConformerArguments = [42,5],
											_actualConformerArguments
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue,_currentValue) {
													_actualConformerArguments = _copyArguments (arguments);
													return _newValue;
												},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect (_expectedConformerArguments,_actualConformerArguments);
									}
								},
								{
									title:
										'Test that the value returned by a conformer function is treated as the new value to be set for the property',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function () {return 'foo'},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect ('foo',_instance.get ('myProperty'));
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is executed before the value of the property has changed',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_myPropertyValuesWhenConformerCalled = [],
											_expectedPropertyValuesWhenConformerCalled = [undefined,5]
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue) {
													_myPropertyValuesWhenConformerCalled.push (this.get ('myProperty'));
													return _newValue;
												},
												value:5
											}
										});
										var _instance = new _Subclass;
										_instance.set ({myProperty:42});
										return this.expect (
											_expectedPropertyValuesWhenConformerCalled,_myPropertyValuesWhenConformerCalled
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s conformer function is called before its onChange handlers are called',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_expectedExecutionOrder = ['conformer','onChange'],
											_actualExecutionOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue) {
													_actualExecutionOrder.push ('conformer');
													return _newValue;
												},
												onChange:function () {_actualExecutionOrder.push ('onChange')},
												value:5
											}
										});
										var _instance = new _Subclass;
										return this.expect (_expectedExecutionOrder,_actualExecutionOrder);
									}
								},
								{
									title:
										'Test that, if a set-get property\'s value does not change as a result of the action of a conformer, then the property\'s onChange handlers are not executed',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_expectedExecutionOrder = ['conformer'],
											_actualExecutionOrder = []
										;
										_Subclass.registerProperties ({
											myProperty:{
												conformer:function (_newValue,_oldValue) {
													_actualExecutionOrder.push ('conformer');
													return _oldValue;
												},
												onChange:function () {_actualExecutionOrder.push ('onChange')},
												value:5
											}
										});
										var _instance = new _Subclass;
										return this.expect (_expectedExecutionOrder,_actualExecutionOrder);
									}
								}
							]
						},
						{
							title:'Test the Changed.[propertyName] event mechanism',
							test:[
								{
									title:
										'Test that the Changed.[propertyName] event for a property is not fired when the property\'s value is set but doesn\'t change value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedEventCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.myProperty',function () {_changedEventCount++});
										_instance.set ({myProperty:'initial value'});
										return this.expect (0,_changedEventCount);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] event for a property is fired when the property\'s value changes during a set',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedEventCount = 0
										;
										_Subclass.registerProperties ({
											myProperty:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.myProperty',function () {_changedEventCount++});
										_instance.set ({myProperty:'new value'});
										return this.expect (1,_changedEventCount);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] events for set-get properties that have changed value are fired after all the onChange handlers for the properties have been executed',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{
												value:'myProperty1 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 2')}
												]
											},
											myProperty2:{
												value:'myProperty2 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 2')}
												]
											}
										});
										var _instance = new _Subclass;
										_coverageAndOrder = [];
										_instance.wire (
											'Changed.myProperty1',
											function () {_coverageAndOrder.push ('Changed.myProperty1 handler')}
										);
										_instance.wire (
											'Changed.myProperty2',
											function () {_coverageAndOrder.push ('Changed.myProperty2 handler')}
										);
										_instance.set ({
											myProperty1:'myProperty1 new value',
											myProperty2:'myProperty2 new value'
										});
										return this.expect (
											[
												'myProperty1 onChange handler 1',
												'myProperty1 onChange handler 2',
												'myProperty2 onChange handler 1',
												'myProperty2 onChange handler 2',
												'Changed.myProperty1 handler',
												'Changed.myProperty2 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the Changed.[propertyName] events for set-get properties that have changed value are fired in the order in which the properties are set - not the order in which they were registered',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'myProperty1 initial value'},
											myProperty2:{value:'myProperty2 initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.myProperty1',
											function () {_coverageAndOrder.push ('Changed.myProperty1 handler')}
										);
										_instance.wire (
											'Changed.myProperty2',
											function () {_coverageAndOrder.push ('Changed.myProperty2 handler')}
										);
										_instance.set ({
											myProperty2:'myProperty2 new value',
											myProperty1:'myProperty1 new value'
										});
										return this.expect (
											[
												'Changed.myProperty2 handler',
												'Changed.myProperty1 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers for the special Changed.[propertyName] event can be wired, unwired, and rewired just like any regular event',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;

										function _makeHandler (_handlerNo) {
											return function () {
												_coverageAndOrder.push (
													'handler ' + _handlerNo + ', value = ' + _instance.get ('myProperty')
												);
											}
										}
										var
											_handler1 = _makeHandler (1),
											_handler2 = _makeHandler (2)
										;
										_instance.wire ('Changed.myProperty',_handler1);
										_instance.wire ('Changed.myProperty',_handler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.wire ('Changed.myProperty',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty');
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'handler 1, value = 1',
												'handler 2, value = 1',
												'handler 2, value = 2',
												'handler 2, value = 3',
												'handler 1, value = 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:'Test premature wiring of a Changed.[propertyName] event',
									test:[
										{
											title:
												'Test that wiring a handler for a Changed.[propertyName] event for a property that has not been registered does not produce a JavaScript error',
											test:function () {
												var
													_Subclass = Uize.subclass (),
													_instance = new _Subclass
												;
												_instance.wire ('Changed.nonExistentProperty',function () {});
												return true;
											}
										},
										{
											title:
												'Test that a handler can be wired for a Changed.[propertyName] event for a property that is not yet registered, and that it will get executed when the property is later registered and its value changes',
											test:function () {
												var
													_Subclass = Uize.subclass (),
													_instance = new _Subclass,
													_changedHandlerCount = 0
												;
												_instance.wire (
													'Changed.myProperty',
													function () {_changedHandlerCount++}
												);
												_Subclass.registerProperties ({myProperty:{}});
												_instance.set ({myProperty:'foo'});
												return this.expect (1,_changedHandlerCount);
											}
										},
										{
											title:
												'Test that a handler can be wired for a Changed.[propertyName] event for a property that is not yet registered, and that it will get executed if the property is registered in an ad hoc fashion by setting its value',
											test:function () {
												var
													_Subclass = Uize.subclass (),
													_instance = new _Subclass,
													_changedHandlerCount = 0
												;
												_instance.wire (
													'Changed.myProperty',
													function () {_changedHandlerCount++}
												);
												_instance.set ({myProperty:'foo'});
												return this.expect (1,_changedHandlerCount);
											}
										}
									]
								}
							]
						},
						{
							title:'Test the Changed.* event mechanism',
							test:[
								{
									title:
										'Test that the Changed.* event is not fired if no set-get properties have changed value during a set',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ({
											myProperty1:'initial value',
											myProperty2:'initial value',
											myProperty3:'initial value'
										});
										return this.expect (0,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired if any set-get property has changed value during a set',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ('myProperty1','new value');
										_instance.set ('myProperty2','new value');
										_instance.set ('myProperty3','new value');
										return this.expect (3,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired only once when multiple set-get properties have changed value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedDotStarHandlerCount = 0
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire ('Changed.*',function () {_changedDotStarHandlerCount++});
										_instance.set ({
											myProperty1:'new value',
											myProperty2:'new value',
											myProperty3:'new value'
										});
										return this.expect (1,_changedDotStarHandlerCount);
									}
								},
								{
									title:
										'Test that the event object for the Changed.* event contains a properties property, which is an object containing values for only those properties that have changed value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_eventObjectPropertiesProperty
										;
										_Subclass.registerProperties ({
											myProperty1:{value:'initial value'},
											myProperty2:{value:'initial value'},
											myProperty3:{value:'initial value'}
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.*',
											function (_event) {_eventObjectPropertiesProperty = _event.properties}
										);
										_instance.set ({
											myProperty2:'initial value',
											myProperty3:'new value'
										});
										return this.expect ({myProperty3:'new value'},_eventObjectPropertiesProperty);
									}
								},
								{
									title:
										'Test that the Changed.* event is fired after all the onChange handlers for set-get properties that have changed value have been executed, but before handlers for the Changed.[propertyName] events for individual properties are executed',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											myProperty1:{
												value:'myProperty1 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty1 onChange handler 2')}
												]
											},
											myProperty2:{
												value:'myProperty2 initial value',
												onChange:[
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 1')},
													function () {_coverageAndOrder.push ('myProperty2 onChange handler 2')}
												]
											}
										});
										var _instance = new _Subclass;
										_coverageAndOrder = [];
										_instance.wire ({
											'Changed.myProperty1':
												function () {_coverageAndOrder.push ('Changed.myProperty1 handler')},
											'Changed.myProperty2':
												function () {_coverageAndOrder.push ('Changed.myProperty2 handler')},
											'Changed.*':
												function () {_coverageAndOrder.push ('Changed.* handler')}
										});
										_instance.set ({
											myProperty1:'myProperty1 new value',
											myProperty2:'myProperty2 new value'
										});
										return this.expect (
											[
												'myProperty1 onChange handler 1',
												'myProperty1 onChange handler 2',
												'myProperty2 onChange handler 1',
												'myProperty2 onChange handler 2',
												'Changed.* handler',
												'Changed.myProperty1 handler',
												'Changed.myProperty2 handler'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers for the special Changed.* event can be wired, unwired, and rewired just like any regular event',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({myProperty:{}});
										var _instance = new _Subclass;

										function _makeHandler (_handlerNo) {
											return function () {
												_coverageAndOrder.push (
													'handler ' + _handlerNo + ', value = ' + _instance.get ('myProperty')
												);
											}
										}
										var
											_handler1 = _makeHandler (1),
											_handler2 = _makeHandler (2)
										;
										_instance.wire ('Changed.*',_handler1);
										_instance.wire ('Changed.*',_handler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.*',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.wire ('Changed.*',_handler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.*');
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'handler 1, value = 1',
												'handler 2, value = 1',
												'handler 2, value = 2',
												'handler 2, value = 3',
												'handler 1, value = 3'
											],
											_coverageAndOrder
										);
									}
								}
							]
						},
						{
							title:'Test the alias mechanism',
							test:[
								{
									title:
										'Test that a set-get property can have multiple aliases, and that its value can be set through any of those aliases',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_valueAfterSetUsingCanonicalName,
											_valueAfterSetUsingAlias1,
											_valueAfterSetUsingAlias2
										;
										_Subclass.registerProperties ({
											_myProperty:{name:'myProperty|myPropertyAlias1|myPropertyAlias2'}
										});
										var _instance = new _Subclass;
										_instance.set ('myProperty','value set using canonical name');
										_valueAfterSetUsingCanonicalName = _instance.get ('myProperty');
										_instance.set ('myPropertyAlias1','value set using alias 1');
										_valueAfterSetUsingAlias1 = _instance.get ('myProperty');
										_instance.set ('myPropertyAlias2','value set using alias 2');
										_valueAfterSetUsingAlias2 = _instance.get ('myProperty');
										return (
											this.expect ('value set using canonical name',_valueAfterSetUsingCanonicalName) &&
											this.expect ('value set using alias 1',_valueAfterSetUsingAlias1) &&
											this.expect ('value set using alias 2',_valueAfterSetUsingAlias2)
										);
									}
								},
								{
									title:
										'Test that getting the values for all set-get properties results in the values of set-get properties with aliases being reported only through their canonical (non-alias) names',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1',
											_myProperty2:'myProperty2|myProperty2Alias1',
											_myProperty3:'myProperty3|myProperty3Alias1|myProperty3Alias2'
										});
										var _instance = new _Subclass;
										return this.expect (
											{
												myProperty1:undefined,
												myProperty2:undefined,
												myProperty3:undefined
											},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that aliases can be specified using the minimal profile syntax as well as the complete profile syntax',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1|myProperty1Alias',
											_myProperty2:{name:'myProperty2|myProperty2Alias'}
										});
										var _instance = new _Subclass;
										_instance.set ({
											myProperty1Alias:'myProperty1 value',
											myProperty2Alias:'myProperty2 value'
										});
										return this.expect (
											{myProperty1:'myProperty1 value',myProperty2:'myProperty2 value'},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that a value can be set for a set-get property using any of its aliases in the constructor when creating an instance',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											_myProperty1:'myProperty1|myProperty1Alias1|myProperty1Alias2',
											_myProperty2:'myProperty2|myProperty2Alias1|myProperty2Alias2',
											_myProperty3:'myProperty3|myProperty3Alias1|myProperty3Alias2'
										});
										var _instance = new _Subclass ({
											myProperty1:'myProperty1 value',
											myProperty2Alias1:'myProperty2 value',
											myProperty3Alias2:'myProperty3 value'
										});
										return this.expect (
											{
												myProperty1:'myProperty1 value',
												myProperty2:'myProperty2 value',
												myProperty3:'myProperty3 value'
											},
											_instance.get ()
										);
									}
								},
								{
									title:
										'Test that a set-get property\'s value can be accessed using any of its registered aliases',
									test:function () {
										var _Subclass = Uize.subclass ();
										_Subclass.registerProperties ({
											_myProperty:{
												name:'myProperty|myPropertyAlias1|myPropertyAlias2',
												value:'myProperty value'
											}
										});
										var _instance = new _Subclass;
										return (
											this.expect ('myProperty value',_instance.get ('myProperty')) &&
											this.expect ('myProperty value',_instance.get ('myPropertyAlias1')) &&
											this.expect ('myProperty value',_instance.get ('myPropertyAlias2'))
										);
									}
								},
								{
									title:
										'Test that handlers can be wired for the Changed.[propertyName] event of a set-get property, using any one of its alias names or its canonical name',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = []
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;
										_instance.wire (
											'Changed.myProperty',
											function () {_coverageAndOrder.push ('handler for Changed.myProperty')}
										);
										_instance.wire (
											'Changed.myPropertyAlias1',
											function () {_coverageAndOrder.push ('handler for Changed.myPropertyAlias1')}
										);
										_instance.wire (
											'Changed.myPropertyAlias2',
											function () {_coverageAndOrder.push ('handler for Changed.myPropertyAlias2')}
										);
										_instance.set ({myProperty:'foo'});
										return this.expect (
											[
												'handler for Changed.myProperty',
												'handler for Changed.myPropertyAlias1',
												'handler for Changed.myPropertyAlias2'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that handlers can be unwired for the Changed.[propertyName] event of a set-get property, using any one of its alias names or its canonical name',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										function _changedHandler1 () {_coverageAndOrder.push ('changed handler 1')}
										function _changedHandler2 () {_coverageAndOrder.push ('changed handler 2')}
										function _changedHandler3 () {_coverageAndOrder.push ('changed handler 3')}

										_instance.wire ('Changed.myProperty',_changedHandler1);
										_instance.wire ('Changed.myProperty',_changedHandler2);
										_instance.wire ('Changed.myProperty',_changedHandler3);

										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myProperty',_changedHandler1);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myPropertyAlias1',_changedHandler2);
										_instance.set ('myProperty',++_newValue);
										_instance.unwire ('Changed.myPropertyAlias2',_changedHandler3);
										_instance.set ('myProperty',++_newValue);

										return this.expect (
											[
												'changed handler 1',
												'changed handler 2',
												'changed handler 3',
												'changed handler 2',
												'changed handler 3',
												'changed handler 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the canonical name of a set-get property is used for the name of the Changed.[propertyName] event that is fired when the property\'s value is changed, regardless of which alias is used when setting the property\'s value',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_coverageAndOrder = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										function _changedHandler1 () {_coverageAndOrder.push ('changed handler 1')}
										function _changedHandler2 () {_coverageAndOrder.push ('changed handler 2')}
										function _changedHandler3 () {_coverageAndOrder.push ('changed handler 3')}

										_instance.wire ('Changed.myProperty',_changedHandler1);
										_instance.wire ('Changed.myPropertyAlias1',_changedHandler2);
										_instance.wire ('Changed.myPropertyAlias2',_changedHandler3);

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												'changed handler 1','changed handler 2','changed handler 3',
												'changed handler 1','changed handler 2','changed handler 3',
												'changed handler 1','changed handler 2','changed handler 3'
											],
											_coverageAndOrder
										);
									}
								},
								{
									title:
										'Test that the canonical name of a set-get property is used for the properties-being-set object that is passed as a parameter to an onChange handler for the set-get property',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_propertiesBeingSetLog = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:{
												name:'myProperty|myPropertyAlias1|myPropertyAlias2',
												onChange:function (_propertiesBeingSet) {
													_propertiesBeingSetLog.push (_propertiesBeingSet);
												}
											}
										});
										var _instance = new _Subclass;

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												{myProperty:1},
												{myProperty:2},
												{myProperty:3}
											],
											_propertiesBeingSetLog
										);
									}
								},
								{
									title:
										'Test that the canonical names of set-get properties are used for the properties object that is provided in the event object for Changed.* events',
									test:function () {
										var
											_Subclass = Uize.subclass (),
											_changedDotStarEventObjectPropertiesLog = [],
											_newValue = 0
										;
										_Subclass.registerProperties ({
											_myProperty:'myProperty|myPropertyAlias1|myPropertyAlias2'
										});
										var _instance = new _Subclass;

										_instance.wire (
											'Changed.*',
											function (_event) {_changedDotStarEventObjectPropertiesLog.push (_event.properties)}
										);

										_instance.set ('myProperty',++_newValue);
										_instance.set ('myPropertyAlias1',++_newValue);
										_instance.set ('myPropertyAlias2',++_newValue);

										return this.expect (
											[
												{myProperty:1},
												{myProperty:2},
												{myProperty:3}
											],
											_changedDotStarEventObjectPropertiesLog
										);
									}
								}
							]
						},
						{
							title:
								'Test that values specified for set-get properties when calling a class\' constructor are respected',
							test:function () {
								var _Subclass = Uize.subclass ();
								_Subclass.registerProperties ({
									_myProperty1:{
										name:'myProperty1',
										value:'myProperty1 initial value'
									},
									_myProperty2:{
										name:'myProperty2',
										value:'myProperty2 initial value'
									},
									_myProperty3:{
										name:'myProperty3',
										value:'myProperty3 initial value'
									}
								});
								var _instance = new _Subclass ({
									myProperty1:'myProperty1 new value',
									_myProperty2:'myProperty2 new value'
								});
								return (
									this.expect ('myProperty1 new value',_instance._myProperty1) &&
									this.expect ('myProperty2 new value',_instance._myProperty2) &&
									this.expect ('myProperty3 initial value',_instance._myProperty3)
								);
							}
						}
					]
				},
				{
					title:'Data Module Pattern with Caching Accessor',
					test:function () {
						var _result;

						/*** declare MyNamespace namespace ***/
							Uize.module ({name:'MyNamespace'});

						/*** declare module with data records for engineering employees ***/
							Uize.module ({
								name:'MyNamespace.EngineeringEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module with data records for finance employees ***/
							Uize.module ({
								name:'MyNamespace.FinanceEmployees',
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										];
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare module that combines data for engineering and finance employees ***/
							Uize.module ({
								name:'MyNamespace.AllEmployees',
								required:[
									'MyNamespace.EngineeringEmployees',
									'MyNamespace.FinanceEmployees'
								],
								builder:function () {
									var _cachedData;

									return function (_getCopy) {
										if (_cachedData && !_getCopy) return _cachedData;

										var _data = [].concat (
											MyNamespace.EngineeringEmployees (true),
											MyNamespace.FinanceEmployees (true)
										);
										return _getCopy ? _data : (_cachedData = _data);
									};
								}
							});

						/*** declare anonymous module that requires all employees module and compares to expected ***/
							Uize.module ({
								required:'MyNamespace.AllEmployees',
								builder:function () {
									_result = Uize.Data.identical (
										MyNamespace.AllEmployees (),
										[
											{firstName:'John',lastName:'Wilkey',department:'engineering'},
											{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
											{firstName:'Mark',lastName:'Strathley',department:'engineering'},
											{firstName:'Marie',lastName:'Stevenson',department:'finance'},
											{firstName:'Craig',lastName:'Pollack',department:'finance'}
										]
									);
								}
							});

						return _result;
					}
				}
			]
		});
	}
});

