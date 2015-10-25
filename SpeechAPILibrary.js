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
        }//End isSupported
        ,executeFunctionIfVoicesInstalled : function(desiredFunctionToExecute)
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
        } //End executeFunctionIfVoicesInstalled
        ,utter : function(textToSpeak)
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
    }//End SpeechSynthesis
    ,SpeechRecognition :
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
        }
        ,Errors:
        {
            NETWORK:                 function(){return "network";}                //Some network communication that was required to complete the recognition failed.
            ,NO_SPEECH:              function(){return "no-speech";}              //No speech was detected.
            ,ABORTED:                function(){return "aborted";}                //Speech input was aborted somehow, maybe by some user-agent-specific behavior such as UI that lets the user cancel speech input.
            ,AUDIO_CAPTURE:          function(){return "audio-capture";}          //Audio capture failed.
            ,NOT_ALLOWED:            function(){return "not-allowed";}            //The user agent is not allowing any speech input to occur for reasons of security, privacy or user preference.
            ,SERVICE_NOT_ALLOWED:    function(){return "service-not-allowed";}    //The user agent is not allowing the web application requested speech service, but would allow some speech service, to be used either because the user agent doesn't support the selected one or because of reasons of security, privacy or user preference.
            ,BAD_GRAMMAR:            function(){return "bad-grammar";}            //There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.
            ,LANGUAGE_NOT_SUPPORTED: function(){return "language-not-supported";} //The language was not supported.*/
        }
        ,ContinuousSession: function ()
        {
            //Private constants
            var _CLASS_NAME           = function(){return "ContinuousSession";};
            var _EMPTY_STRING         = function(){return "";};
            var _STRING_TYPE_STRING   = function(){return "string";};
            var _BOOLEAN_TYPE_STRING  = function(){return "boolean";};
            var _FUNCTION_TYPE_STRING = function(){return "function";};

            //Private variables:
            var _startRequested                  = false;
            var _stopRequested                   = false;
            var _recognition                     = null;
            var _interimTranscript               = "";
            var _finalTranscript                 = "";
            var _encounteredError                = null;
            var _ignoreSpokenPunctuationCommands = true;
            var _includeConfidencesInTranscripts = false;

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
            this.includeConfidencesInTranscripts = function()
            {
                return _includeConfidencesInTranscripts;
            };

            this.ignoreSpokenPunctuationCommands = function()
            {
                return _ignoreSpokenPunctuationCommands;
            };

            this.errorEncountered = function()
            {
                return (_encounteredError!=null);
            };

            this.saveEncounteredError = function(desiredErrorObject)
            {
                var FUNCTION_NAME = "saveEncounteredError()";
                var LOG_PREFIX    = _CLASS_NAME()+"."+FUNCTION_NAME+": ";

                if(desiredErrorObject)
                {
                    if(desiredErrorObject instanceof webkitSpeechRecognitionError)
                    {
                        _encounteredError = desiredErrorObject;
                    }
                    else
                    {
                        var logMessage = LOG_PREFIX + "Unable to save error object.  Object was not an instance of webkitSpeechRecognitionError";
                        console.log(logMessage);
                    }
                }
            };

            this.getEncounteredError = function()
            {
                return _encounteredError;
            };

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
                            if(_finalTranscript!=_EMPTY_STRING())
                            {
                                var lastCharOfFinalTranscript = _finalTranscript.charAt(_finalTranscript.length - 1);
                                var firstCharOfDesiredText    = desiredText.charAt(0);

                                if(lastCharOfFinalTranscript != ' ' && firstCharOfDesiredText != ' ')
                                {
                                    _finalTranscript+=' ';
                                }
                            }
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

            this.startRequested = function()
            {
                return _startRequested;
            };

            this.stopRequested = function()
            {
                return _stopRequested;
            };

            this.start = function(resetTranscriptsFromLastSession, includeConfidencesInTranscripts, ignoreSpokenPunctuationCommands)
            {
                var FUNCTION_NAME    = "start()";
                var LOG_PREFIX       = _CLASS_NAME()+"."+FUNCTION_NAME+": ";
                var logMessage       = null;

                var resetTranscripts = null;

                _startRequested      = true;
                _stopRequested       = false;
                _encounteredError    = null;

                if
                (
                    (ignoreSpokenPunctuationCommands!=undefined)
                    &&(ignoreSpokenPunctuationCommands!=null)
                    &&(typeof(ignoreSpokenPunctuationCommands)==_BOOLEAN_TYPE_STRING())
                )
                {
                    _ignoreSpokenPunctuationCommands = ignoreSpokenPunctuationCommands;
                }
                else
                {
                    _ignoreSpokenPunctuationCommands = true;
                }

                if
                (
                    (resetTranscriptsFromLastSession!=undefined)
                    &&(resetTranscriptsFromLastSession!=null)
                    &&(typeof(resetTranscriptsFromLastSession)==_BOOLEAN_TYPE_STRING())
                )
                {
                    resetTranscripts = resetTranscriptsFromLastSession;
                }
                else
                {
                    resetTranscripts = true;
                }

                if
                (
                    (includeConfidencesInTranscripts!=undefined)
                    &&(includeConfidencesInTranscripts!=null)
                    &&(typeof(includeConfidencesInTranscripts)==_BOOLEAN_TYPE_STRING())
                )
                {
                    _includeConfidencesInTranscripts = includeConfidencesInTranscripts;
                }
                else
                {
                    _includeConfidencesInTranscripts = false;
                }

                if(resetTranscripts)
                {
                    this.resetFinalTranscriptToEmptyString();
                    this.resetInterimTranscriptToEmptyString();
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

                var sessionInstance = this;

                function onresult_scopePreserverWrapper(desiredFunctionToExecute, desiredSessionInstance)
                {
                    return function onresult_scopePreserverWrapperReturnPayload(event)
                    {
                        var PAYLOAD_FUNCTION_NAME = "onresult_scopePreserverWrapperReturnPayload()";
                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Entering "+PAYLOAD_FUNCTION_NAME+".";
                        console.log(logMessage);
                        if(desiredSessionInstance)
                        {
                            try
                            {
                                //Handle on result event:
                                var resultIndex       = event.resultIndex;
                                var resultArrayLength = event.results.length;

                                interimTranscript = "";
                                desiredSessionInstance.resetInterimTranscriptToEmptyString();

                                for (var currentIndex=resultIndex; currentIndex < resultArrayLength; ++currentIndex)
                                {
                                    var currentRecognitionResult            = event.results[currentIndex];
                                    var currentRecognitionResultAlternative = currentRecognitionResult[0];
                                    var transcriptToAppend                  = currentRecognitionResultAlternative.transcript;
                                    var transcriptConfidence                = Math.floor(currentRecognitionResultAlternative.confidence*100);

                                    if(desiredSessionInstance.ignoreSpokenPunctuationCommands())
                                    {
                                        var PERIOD_SEARCH     = '.';
                                        var PERIOD_REPLACE    = ' period';
                                        var COMMA_SEARCH      = ',';
                                        var COMMA_REPLACE     = ' comma';
                                        var COLON_SEARCH      = ':';
                                        var COLON_REPLACE     = ' colon';
                                        var PARAGRAPH_SEARCH  = '\n\n';
                                        var PARAGRAPH_REPLACE = ' new paragraph ';

                                        transcriptToAppend = transcriptToAppend.replace(PERIOD_SEARCH,    PERIOD_REPLACE);
                                        transcriptToAppend = transcriptToAppend.replace(COMMA_SEARCH,     COMMA_REPLACE);
                                        transcriptToAppend = transcriptToAppend.replace(COLON_SEARCH,     COLON_REPLACE);
                                        transcriptToAppend = transcriptToAppend.replace(PARAGRAPH_SEARCH, PARAGRAPH_REPLACE);
                                    }

                                    if(desiredSessionInstance.includeConfidencesInTranscripts())
                                    {
                                        transcriptToAppend += "[" + transcriptConfidence + "]";
                                    }

                                    if(currentRecognitionResult.isFinal)
                                    {
                                        desiredSessionInstance.appendStringToFinalTranscript(transcriptToAppend);
                                    }
                                    else
                                    {
                                        desiredSessionInstance.appendStringToInterimTranscript(transcriptToAppend);
                                    }
                                }

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
                            }
                        }
                    };
                }

                if(_recognition)
                {
                    try
                    {
                        _recognition.onresult = onresult_scopePreserverWrapper(desiredFunctionToExecute,sessionInstance);
                    }
                    catch(caughtException)
                    {
                        logMessage = LOG_PREFIX+"ERROR: An exception was encountered when attempting to assign the recognition.onresult event handler.";
                        console.log(logMessage);
                        console.log(caughtException);
                    }

                }
                else
                {
                    logMessage = LOG_PREFIX+"ERROR: Unable to assign onresult event handler. Recognition object not set.";
                    console.log(logMessage);
                }
                //
                //if(_recognition)
                //{
                //    if(isFunction(desiredFunctionToExecute))
                //    {
                //        _recognition.onresult=desiredFunctionToExecute;
                //    }
                //    else
                //    {
                //        logMessage = LOG_PREFIX+"Error: Unable to assign onresult event handler. The desiredFunctionToExecute variable was not a function!";
                //        console.log(logMessage);
                //    }
                //}
                //else
                //{
                //    logMessage = LOG_PREFIX+"Error: Unable to assign onresult event handler. Recognition object not set.";
                //    console.log(logMessage);
                //}
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
                                //Stop the session if it was not requested:
                                if(!desiredSessionInstance.startRequested())
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Session has started, but it was not requested.  Requesting stop.";
                                    console.log(logMessage);
                                    desiredSessionInstance.stop();
                                }
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
                                /**
                                 * We need to restart the session if:
                                 * 1) Not requested & no error.
                                 * 2) Not requested & error was no-speech.
                                 */
                                if(desiredSessionInstance.stopRequested())
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Stop was requested.";
                                    console.log(logMessage);
                                }
                                else
                                {
                                    logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Stop was not requested.";
                                    console.log(logMessage);

                                    var resetTranscriptsFromLastSession = false;
                                    var includeConfidencesInTranscripts = desiredSessionInstance.includeConfidencesInTranscripts();
                                    var ignoreSpokenPunctuationCommands = desiredSessionInstance.ignoreSpokenPunctuationCommands();
                                    console.log(logMessage);

                                    if(desiredSessionInstance.errorEncountered())
                                    {
                                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Stop was triggered by error.";
                                        console.log(logMessage);

                                        //Only resume the session if the error message is no-speech:
                                        if(desiredSessionInstance.getEncounteredError().error==SpeechAPI.SpeechRecognition.Errors.NO_SPEECH())
                                        {
                                            logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": The trigger error was 'no-speech'. Restarting session.";
                                            console.log(logMessage);

                                            desiredSessionInstance.start(resetTranscriptsFromLastSession,includeConfidencesInTranscripts,ignoreSpokenPunctuationCommands);
                                        }
                                    }
                                    else
                                    {
                                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Stop was not triggered by error. Restarting session.";
                                        console.log(logMessage);
                                        desiredSessionInstance.start(resetTranscriptsFromLastSession,includeConfidencesInTranscripts,ignoreSpokenPunctuationCommands);
                                    }
                                }

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

                        logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An error was encountered during recognition!";
                        console.log(logMessage);

                        console.log(event);

                        try
                        {
                            var eventErrorMessage = event.error;
                            logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": The event's error message was: '" +eventErrorMessage+"'.";
                            console.log(logMessage);
                        }
                        catch(caughtException)
                        {
                            logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": ERROR: An exception was encountered when attempting to examine the event error object.";
                            console.log(logMessage);
                            console.log(caughtException);
                        }

                        if(desiredSessionInstance)
                        {
                            try
                            {
                                desiredSessionInstance.saveEncounteredError(event);

                                var currentInterimTranscript = desiredSessionInstance.getInterimTranscript();
                                var currentFinalTranscript   = desiredSessionInstance.getFinalTranscript();

                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Current interim transcript: " + currentInterimTranscript;
                                console.log(logMessage);
                                logMessage = LOG_PREFIX+PAYLOAD_FUNCTION_NAME+": Current final transcript: " + currentFinalTranscript;
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
