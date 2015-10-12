/**
 * Author:  Robert Derveloy
 * Written: 2013-01-15
 * 
 * Copyright (c) 2013-2015 -  Robert Derveloy
 * 
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
 */
 
var SpeechAPI = 
{
    SpeechSynthesis :
    {
        isSupported : function()
        {
            var SPEECH_SYNTHESIS_STRING = 'speechSynthesis';
            var result                  = false;

            try
            {
                if(SPEECH_SYNTHESIS_STRING in window)
                {
                    result = true;
                }    
            }
            catch(caughtException)
            {
                var message = "SpeechAPI.SpeechSynthesis.isSupported(): Exception encountered while performing speech synthesis detection.";
                console.log(message);
                console.log(caughtException);
            }

            return result;
        },//End isSupported
        executeFunctionIfVoicesInstalled : function(desiredFunctionToExecute)
        {
            function scopePreserverWrapper(desiredFunctionToExecute)
            {
                return function (event)
                {            
                    var voiceArray = window.speechSynthesis.getVoices();                       

                    if(voiceArray.length>0)
                    {
                        if(desiredFunctionToExecute)
                        {
                            console.log('Payload function exists!');
                            return desiredFunctionToExecute(voiceArray);
                        }
                    }
                    else
                    {
                        console.log('Voices NOT installed!');
                    } 

                };
            }

            window.speechSynthesis.onvoiceschanged = scopePreserverWrapper(desiredFunctionToExecute);
        }, //End executeFunctionIfVoicesInstalled
        utter : function(textToSpeak)
        {
            var STRING_TYPE  = 'string';
            var EMPTY_STRING = '';
            if(textToSpeak)
            {
                if(typeof textToSpeak == STRING_TYPE)
                {
                    if(textToSpeak != EMPTY_STRING)
                    {
                        if(SpeechAPI.SpeechSynthesis.isSupported())
                        {
                            var msg = new SpeechSynthesisUtterance(textToSpeak);
                            speechSynthesis.speak(msg);            
                        }
                        else
                        {
                            console.log("ERROR: Speech synthesis is not supported by this browser!");
                        }
                    }
                }
            }
        }//End utter
    },//End SpeechSynthesis
    SpeechRecognition :
    {
        isSupported: function()
        {   
            var result     = false;
            var STT_STRING = 'webkitSpeechRecognition';

            try
            {
                if(STT_STRING in window)
                {
                    result = true;
                }
            }
            catch(caughtException)
            {
                var message = "SpeechAPI.SpeechRecognition.isSupported(): Exception encountered while performing speech recognition detection.";
                console.log(message);
                console.log(caughtException);
            }
            return result;
        },
        ContinuousSession: function ()
        {
            //Private constants
            var _CLASS_NAME           = function(){return "ContinuousSession";};
            var _EMPTY_STRING         = function(){return "";};
            var _STRING_TYPE_STRING   = function(){return "string";};
            var _FUNCTION_TYPE_STRING = function(){return "function";};

            //Private variables:
            var _startRequested    = false;
            var _stopRequested     = false;
            var _recognition       = null;
            var _interimTranscript = "";
            var _finalTranscript   = "";

            var _privateString = "private message";

            if(SpeechAPI.SpeechRecognition.isSupported())
            {
                _recognition                = new webkitSpeechRecognition();
                _recognition.continuous     = true;
                _recognition.interimResults = true;
            }

            //Private functions:
            function isFunction(desiredVariable)
            {
                var result = false;

                if(desiredVariable)
                {
                    if(typeof(desiredVariable)==_FUNCTION_TYPE_STRING())
                    {
                        result = true;
                    }
                }

                return result;
            };

            //Public functions:
            this.getFinalTranscript = function()
            {
                return _finalTranscript;
            };

            this.resetFinalTranscriptToEmptyString = function()
            {
                _finalTranscript=_EMPTY_STRING();
            };

            this.assignStringToFinalTranscript = function(desiredText)
            {
                var FUNCTION_NAME = "assignStringToFinalTranscript()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                if(desiredText)
                {
                    if(typeof(desiredText)==_STRING_TYPE_STRING())
                    {
                        if(desiredText!=_EMPTY_STRING())
                        {
                            _finalTranscript = desiredText;
                        }
                        else
                        {
                            logMessage = LOG_PREFIX+"WARNING: The value of the desiredText variable was an empty string.  Using built-in reset function.";
                            console.log(logMessage);
                            this.resetFinalTranscriptToEmptyString();
                        }
                    }
                    else
                    {
                        logMessage = LOG_PREFIX+"ERROR: The desiredText variable was not a string!  Aborting request.";
                        console.log(logMessage);
                    }
                }
            };

            this.appendStringToFinalTranscript = function(desiredText)
            {
                var FUNCTION_NAME = "appendStringToFinalTranscript()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                if(desiredText)
                {
                    if(typeof(desiredText)==_STRING_TYPE_STRING())
                    {
                        if(desiredText!=_EMPTY_STRING())
                        {
                            _finalTranscript += desiredText;
                        }
                        else
                        {
                            logMessage = LOG_PREFIX+"WARNING: The value of the desiredText variable was an empty string.  Aborting request.";
                            console.log(logMessage);
                        }
                    }
                    else
                    {
                        logMessage = LOG_PREFIX+"ERROR: The desiredText variable was not a string!  Aborting request.";
                        console.log(logMessage);
                    }
                }
            };

            this.getInterimTranscript = function()
            {
                return _interimTranscript;
            };

            this.resetInterimTranscriptToEmptyString = function()
            {
                _interimTranscript=_EMPTY_STRING();
            };

            this.assignStringToInterimTranscript = function(desiredText)
            {
                var FUNCTION_NAME = "assignStringToInterimTranscript()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                if(desiredText)
                {
                    if(typeof(desiredText)==_STRING_TYPE_STRING())
                    {
                        if(desiredText!=_EMPTY_STRING())
                        {
                            _interimTranscript = desiredText;
                        }
                        else
                        {
                            logMessage = LOG_PREFIX+"WARNING: The value of the desiredText variable was an empty string.  Using built-in reset function.";
                            console.log(logMessage);
                            this.resetInterimTranscriptToEmptyString();
                        }
                    }
                    else
                    {
                        logMessage = LOG_PREFIX+"ERROR: The desiredText variable was not a string!  Aborting request.";
                        console.log(logMessage);
                    }
                }
            };

            this.appendStringToInterimTranscript = function(desiredText)
            {
                var FUNCTION_NAME = "appendStringToInterimTranscript()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                if(desiredText)
                {
                    if(typeof(desiredText)==_STRING_TYPE_STRING())
                    {
                        if(desiredText!=_EMPTY_STRING())
                        {
                            _interimTranscript += desiredText;
                        }
                        else
                        {
                            logMessage = LOG_PREFIX+"WARNING: The value of the desiredText variable was an empty string.  Aborting request.";
                            console.log(logMessage);
                        }
                    }
                    else
                    {
                        logMessage = LOG_PREFIX+"ERROR: The desiredText variable was not a string!  Aborting request.";
                        console.log(logMessage);
                    }
                }
            };

            this.getPrivateString = function()
            {
                return _privateString;
            };

            this.appendToPrivateString = function(desiredText)
            {
                if(desiredText)
                {
                    _privateString+=desiredText;
                }
            };

            this.resetPrivateString = function()
            {
                _privateString=_EMPTY_STRING();
            };

            this.startRequested = function()
            {
                return _startRequested;
            };

            this.stopRequested = function()
            {
                return _stopRequested;
            };

            this.start = function(preserveTranscripts)
            {
                var FUNCTION_NAME = "start()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                _startRequested = true;
                _stopRequested  = false;

                if(!preserveTranscripts)
                {
                    this.resetFinalTranscriptToEmptyString();
                    this.resetInterimTranscriptToEmptyString();
                    this.resetPrivateString();
                }

                if(_recognition)
                {

                    try
                    {
                        logMessage = LOG_PREFIX+"Requesting recognition start...";
                        console.log(logMessage);
                        _recognition.start();
                    }
                    catch(err)
                    {
                        logMessage = LOG_PREFIX+"Exception encountered while requesting recognition start.";
                        console.log(logMessage);
                        console.log(err);
                    }
                }
                else
                {
                    logMessage = LOG_PREFIX+"ERROR: Recognition object was null!";
                    console.log(logMessage);
                }
            };

            this.stop = function()
            {
                var FUNCTION_NAME = "stop()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                _stopRequested  = true;
                _startRequested = false;

                if(_recognition)
                {
                    try
                    {
                        logMessage = LOG_PREFIX+"Requesting recognition stop...";
                        console.log(logMessage);
                        _recognition.stop();
                    }
                    catch(err)
                    {
                        logMessage = LOG_PREFIX+"Exception encountered while requesting recognition stop.";
                        console.log(logMessage);
                        console.log(err);
                    }
                }
                else
                {
                    logMessage = LOG_PREFIX+"ERROR: Recognition object was null!";
                    console.log(logMessage);
                }
            };

            this.setEventHandler_onresult = function(desiredFunctionToExecute)
            {
                var FUNCTION_NAME = "setEventHandler_onresult()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                if(_recognition)
                {
                    if(isFunction(desiredFunctionToExecute))
                    {
                        _recognition.onresult=desiredFunctionToExecute;
                    }
                    else
                    {
                        logMessage = LOG_PREFIX+"Error: Unable to assign onresult event handler. The desiredFunctionToExecute variable was not a function!";
                        console.log(logMessage);
                    }
                }
                else
                {
                    logMessage = LOG_PREFIX+"Error: Unable to assign onresult event handler. Recognition object not set.";
                    console.log(logMessage);
                }
            };

            this.setEventHandler_onstart = function(desiredFunctionToExecute)
            {
                var FUNCTION_NAME = "setEventHandler_onstart()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                var sessionInstance = this;

                function onstart_scopePreserverWrapper(desiredFunctionToExecute, desiredSessionInstance)
                {
                    return function onstart_scopePreserverWrapperReturnPayload(event)
                    {
                        var PAYLOAD_FUNCTION_NAME = "onstart_scopePreserverWrapperReturnPayload()";
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Entering "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);
                        if(desiredSessionInstance)
                        {
                            try
                            {
                                desiredSessionInstance.appendToPrivateString("  Hi!  I've been appended by onstart_scopePreserverWrapperReturnPayload()!");
                                console.log(desiredSessionInstance.getPrivateString());

                                //TODO: Stop the session if it was not requested.
                            }
                            catch(caughtException)
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to work with the recognition session instance.";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }

                        if(desiredFunctionToExecute)
                        {
                            if(isFunction(desiredFunctionToExecute))
                            {
                                try
                                {
                                    desiredFunctionToExecute(event);
                                }
                                catch (caughtException)
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to execute the desired recognition.onstart event handler.";
                                    console.log(logMessage);
                                    console.log(caughtException);
                                }
                            }
                            else
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: The desiredFunctionToExecute variable was not a function!";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Leaving "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);
                    };
                }

                if(_recognition)
                {
                    try
                    {
                        _recognition.onstart = onstart_scopePreserverWrapper(desiredFunctionToExecute,sessionInstance);
                    }
                    catch(caughtException)
                    {
                        logMessage = LOG_PREFIX+"ERROR: An exception was encountered when attempting to assign the recognition.onstart event handler.";
                        console.log(logMessage);
                        console.log(caughtException);
                    }

                }
                else
                {
                    logMessage = LOG_PREFIX+"ERROR: Unable to assign onstart event handler. Recognition object not set.";
                    console.log(logMessage);
                }
            };

            this.setEventHandler_onend = function(desiredFunctionToExecute)
            {
                var FUNCTION_NAME = "setEventHandler_onend()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                var sessionInstance = this;

                function onend_scopePreserverWrapper(desiredFunctionToExecute, desiredSessionInstance)
                {
                    return function onend_scopePreserverWrapperReturnPayload(event)
                    {
                        var PAYLOAD_FUNCTION_NAME = "onend_scopePreserverWrapperReturnPayload()";
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Entering "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);

                        if(desiredSessionInstance)
                        {
                            try
                            {
                                desiredSessionInstance.appendToPrivateString("  Hi!  I've been appended by onend_scopePreserverWrapperReturnPayload()!");
                                console.log(desiredSessionInstance.getPrivateString());

                                //TODO: Determine if we need to restart the session and do so if needed.
                            }
                            catch(caughtException)
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to work with the recognition session instance.";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }
                        if(desiredFunctionToExecute)
                        {
                            if(isFunction(desiredFunctionToExecute))
                            {
                                try
                                {
                                    desiredFunctionToExecute(event);
                                }
                                catch (caughtException)
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to execute the desired recognition.onend event handler.";
                                    console.log(logMessage);
                                    console.log(caughtException);
                                }
                            }
                            else
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: The desiredFunctionToExecute variable was not a function!";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Leaving "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);
                    };
                }

                if(_recognition)
                {
                    try
                    {
                        _recognition.onend = onend_scopePreserverWrapper(desiredFunctionToExecute,sessionInstance);
                    }
                    catch(caughtException)
                    {
                        logMessage = LOG_PREFIX+"ERROR: An exception was encountered when attempting to assign the recognition.onend event handler.";
                        console.log(logMessage);
                        console.log(caughtException);
                    }
                }
                else
                {
                    logMessage = LOG_PREFIX+"ERROR: Unable to assign onend event handler. Recognition object not set.";
                    console.log(logMessage);
                }
            };

            this.setEventHandler_onerror = function(desiredFunctionToExecute)
            {
                var FUNCTION_NAME = "setEventHandler_onerror()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage    = null;

                var sessionInstance = this;

                function onerror_scopePreserverWrapper(desiredFunctionToExecute, desiredSessionInstance)
                {
                    return function onerror_scopePreserverWrapperReturnPayload(event)
                    {
                        var PAYLOAD_FUNCTION_NAME = "onerror_scopePreserverWrapperReturnPayload()";
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Entering "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);

                        var logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An error was encountered during recognition!"
                        console.log(logMessage);
                        console.log(event);

                        //TODO: Determine error type and behave according to encountered error!
                        //TODO: Maybe set an error encountered flag and or restart session flag to restart if the error type is something like 'no-speech'?

                        if(desiredSessionInstance)
                        {
                            try
                            {
                                desiredSessionInstance.appendToPrivateString("  Hi!  I've been appended by "+PAYLOAD_FUNCTION_NAME+"!");
                                console.log(desiredSessionInstance.getPrivateString());

                                var currentInterimTranscript = desiredSessionInstance.getInterimTranscript();
                                var currentFinalTranscript   = desiredSessionInstance.getFinalTranscript();

                                var logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Current interim transcript: " + currentInterimTranscript;
                                console.log(logMessage);
                                var logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Current final transcript: " + currentFinalTranscript;
                                console.log(logMessage);
                            }
                            catch(caughtException)
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to work with the recognition session instance.";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }
                        if(desiredFunctionToExecute)
                        {
                            if(isFunction(desiredFunctionToExecute))
                            {
                                try
                                {
                                    desiredFunctionToExecute(event);
                                }
                                catch (caughtException)
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to execute the desired recognition.onerror event handler.";
                                    console.log(logMessage);
                                    console.log(caughtException);
                                }
                            }
                            else
                            {
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: The desiredFunctionToExecute variable was not a function!";
                                console.log(logMessage);
                                console.log(caughtException);
                            }
                        }
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Leaving "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);
                    };
                }

                if(_recognition)
                {
                    try
                    {
                        _recognition.onerror = onerror_scopePreserverWrapper(desiredFunctionToExecute,sessionInstance);
                    }
                    catch(caughtException)
                    {
                        logMessage = LOG_PREFIX+"ERROR: An exception was encountered when attempting to assign the recognition.onerror event handler.";
                        console.log(logMessage);
                        console.log(caughtException);
                    }
                    /*
                     if (isFunction(desiredFunctionToExecute))
                     {
                     _recognition.onerror = desiredFunctionToExecute;
                     }
                     else
                     {
                     logMessage = LOG_PREFIX+"Error: Unable to assign onerror event handler. The desiredFunctionToExecute variable was not a function!";
                     console.log(logMessage);
                     }
                     */
                }
                else
                {
                    logMessage = LOG_PREFIX+"Error: Unable to assign onerror event handler. Recognition object not set.";
                    console.log(logMessage);
                }
            };

        }

    }
};
