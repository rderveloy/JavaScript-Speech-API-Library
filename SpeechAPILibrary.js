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
    TextToSpeech : 
    {
        isSupported : function()
        {
            var result     = false;
            var TTS_STRING = 'speechSynthesis';

            try
            {
                if(TTS_STRING in window)
                {
                    result = true;
                }    
            }
            catch(err)
            {
                var message = "SpeechAPI->TextToSpeech->isSupported(): Exception encountered while performing speech synthesis detection.";
                console.log(message);
                console.log(err);
            }

            return result;
        },//End isSupported
        executeFunctionIfVoicesInstalled : function(desiredFunctionToExecute)
        {
            function scopePreserverWrapper(desiredFunctionToExecute)
            {
                return function ()
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
                        if(SpeechAPI.TextToSpeech.isSupported())
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
    },//End TextToSpeech
    SpeechToText :
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
            catch(err)
            {
                var message = "SpeechAPI->SpeechToText->isSupported(): Exception encountered while performing speech recognition detection.";
                console.log(message);
                console.log(err);
            }
            return result;
        },
        ContinuousSession: function ()
        {
            // Instance stores a reference to the Singleton
            var instance;

            function init()
            {
                // Singleton
                var finalTranscript   = "";
                var interimTranscript = "";
                var recognition;

                var STRING_TYPE  = 'string';
                var EMPTY_STRING = '';

                if(SpeechAPI.SpeechToText.isSupported())
                {
                    recognition                = new webkitSpeechRecognition();
                    recognition.continuous     = true;
                    recognition.interimResults = true;

                    recognition.onstart = function defaultRecognitionEventHandler_onstart()
                    {
                        console.log("SpeechAPI->SpeechToText->ContinousSession(): Recognition started.");
                    };
                    recognition.onresult = function defaultRecognitionEventHandler_onresult(event)
                    {
                        var sessionInstance = SpeechAPI.SpeechToText.ContinuousSession().getInstance();

                        sessionInstance.resetInterimTranscript();

                        console.log(event);

                        var resultIndex       = event.resultIndex;
                        var resultArrayLength = event.results.length;

                        for (var currentIndex=resultIndex; currentIndex < resultArrayLength; ++currentIndex)
                        {
                            var currentRecognitionResult                       = event.results[currentIndex];
                            var currentRecognitionResultAlternative            = currentRecognitionResult[0];
                            var currentRecognitionResultAlternativeTranscript  = currentRecognitionResult.transcript;

                            if(currentRecognitionResultAlternative.isFinal)
                            {
                                sessionInstance.appendToFinalTranscript(currentRecognitionResultAlternativeTranscript);
                            }
                            else
                            {
                                sessionInstance.appendToInterimTranscript(currentRecognitionResultAlternativeTranscript);
                            }


                        }
                        console.log("Interim: "+sessionInstance.getInterimTranscript());
                        console.log("Final:   "+sessionInstance.getFinalTranscript());

                    };
                    recognition.onerror = function defaultRecognitionEventHandler_onerror(event)
                    {
                        console.log("SpeechAPI->SpeechToText->ContinousSession(): Recognition error!");
                        console.log(event);
                    };
                    recognition.onend = function defaultRecognitionEventHandler_onend()
                    {
                        console.log("SpeechAPI->SpeechToText->ContinousSession(): Recognition ended.");
                    };
                }
                else
                {
                    console.log("ERROR: Speech recognition is not supported by this browser!");
                }

                //Public stuff here:
                return {
                    // Public methods and variables
                    getFinalTranscript: function ()
                    {
                        return finalTranscript;
                    },
                    resetFinalTranscript: function ()
                    {
                        finalTranscript="";
                        //console.log("SpeechAPI->SpeechToText->ContinousSession->resetInterimTranscript(): Final transcript reset.");
                    },
                    appendToFinalTranscript: function (desiredValue)
                    {
                        console.log("SpeechAPI->SpeechToText->ContinousSession->appendToFinalTranscript()");
                        if(desiredValue)
                        {
                            if(typeof desiredValue == STRING_TYPE)
                            {
                                if(desiredValue != EMPTY_STRING)
                                {
                                    finalTranscript+=desiredValue;
                                }
                            }
                        }
                    },
                    getInterimTranscript: function ()
                    {
                        return interimTranscript;
                    },
                    resetInterimTranscript: function ()
                    {
                        interimTranscript="";
                        //console.log("SpeechAPI->SpeechToText->ContinousSession->resetInterimTranscript(): Interim transcript reset.");
                    },
                    appendToInterimTranscript: function (desiredValue)
                    {
                        if(desiredValue)
                        {
                            if(typeof desiredValue == STRING_TYPE)
                            {
                                if(desiredValue != EMPTY_STRING)
                                {
                                    interimTranscript+=desiredValue;
                                }
                            }
                        }
                    },
                    getRecognitionObject: function()
                    {
                        return recognition;
                    },
                    start: function()
                    {
                        recognition.start();
                        console.log("SpeechAPI->SpeechToText->ContinousSession->start(): Starting session.");
                    },
                    stop: function()
                    {

                        recognition.stop();
                        console.log("SpeechAPI->SpeechToText->ContinousSession->start(): Stopping session.");
                    }

                };

            };

            return{
                // Get the Singleton instance if one exists
                // or create one if it doesn't
                getInstance: function ()
                {
                    if ( !instance )
                    {
                        instance = init();
                    }
                    return instance;
                }

            };

        }

    }
};
