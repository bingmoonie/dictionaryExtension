$(document).ready(function(){
    $('html').mouseup(function() {
        var selectedText = getSelectedText().toLowerCase();
		var sentence = new Lexer().lex(selectedText);

        if(selectedText > ''){
			var word=prompt("Please enter a word to search for:","Enter a word");
			word=word.toLowerCase();
			var phrases=new Lexer().lex(word);
			//alert(phrases);
			var wordNumber=0;
			while(wordNumber<phrases.length){
               //alert(wordNumber.toString());
			   if(jQuery.inArray( phrases[wordNumber], sentence )===-1){
			       //alert(phrases[wordNumber]);
			       word=prompt("The word must be in the sentence! Please enter a word to search for:","Enter a word");
				   phrases=new Lexer().lex(word);
			       wordNumber=0;}
			    else wordNumber++;
			 }
		$.post( "http://text-processing.com/api/tag/", { text: selectedText }, function( data ) {
				   //alert( data.text );
				   var tempTag=data.text.substring(data.text.search(word)+word.length+1,data.text.search(word)+word.length+4);
				   //alert(tempTag);
				   if (tempTag[0]+tempTag[1]==="NN")var tag= "&partOfSpeech=noun";
				   else if (tempTag[0]+tempTag[1]==="JJ")var tag= "&partOfSpeech=adjective";
				   else if (tempTag[0]+tempTag[1]==="VB")var tag= "&partOfSpeech=verb";
				   else if (tempTag[0]+tempTag[1]==="RB")var tag= "&partOfSpeech=adverb";
				   else var tag="";
				   //alert(word);
					$.getJSON("http://api.wordnik.com/v4/word.json/"+word+"/definitions?limit=200"+tag+"&includeRelated=true&sourceDictionaries=wiktionary,wordnet,webster&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
					function ( json ){
					    //alert(sentence);
						var score=[];
						var bestScore=0;
						var bestIndex=0;
						var stopwords=['S','i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
						var punctuation="~`!1@#$%^&*()_+234567890-={}|:\"<>?[]\;',./";
						for (var j=0;j<json.length;j++){
							score[j]=0;
							var tempText=new Lexer().lex(json[j].text.toLowerCase());
							//alert(tempText);
						   for(var i=0;i<sentence.length;i++){
							   if (jQuery.inArray(sentence[i],stopwords)===-1 && jQuery.inArray(sentence[i],punctuation)===-1){
								   if (jQuery.inArray(sentence[i],tempText)!=-1 && sentence[i]!=word) {score[j]+=1; //alert(sentence[i]);
								   }
								   if (jQuery.inArray(sentence[i],json[j].relatedWords.words)!=-1&& sentence[i]!=word) {score[j]+=1; //alert(sentence[i]);
								   }
								   if (jQuery.inArray(sentence[i],json[j].labels.text)!=-1&& sentence[i]!=word) {score[j]+=1; //alert(sentence[i]);
								   }
								   //$.getJSON("http://api.wordnik.com/v4/word.json/"+sentence[i]+"/definitions?limit=200&includeRelated=true&sourceDictionaries=wordnet&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
					                // function ( jsonTEMP ){
									  //  var tempDef=new Lexer().lex(jsonTEMP[0].text);
										//for(var k=0;j<tempDef.length;k++){
										  //  if (jQuery.inArray(tempDef[k],stopwords)===-1 && jQuery.inArray(tempDef[k],punctuation)===-1){
											//	if (jQuery.inArray(tempDef[k],tempText)!=-1) score[j]+=1;
												//if (jQuery.inArray(tempDef[k],json[j].relatedWords.words)!=-1) score[j]+=1;
											//}
										//}
									//});	
              					}
							}
							if (score[j]>bestScore){
								bestScore=score[j];
								bestIndex=j;
							}
						}
						if (json.length===0) alert("Sorry but we cannot find the definition");
						else alert(json[bestIndex].text);
						//alert(tag);
						//var alldefinitions="";
						//for(w=0;w<json.length;w++){alldefinitions=alldefinitions.concat(w.toString()+json[w].text);}
						//alert(alldefinitions);
						//alert(bestIndex.toString());
						//alert(bestScore.toString());
						});
						}, "json");	
    }});

    function getSelectedText() {
	    //get the text selected by the mouse
        if (window.getSelection) {
            var selection = window.getSelection().toString();
            if(selection.trim() > ''){
                return selection;
            }
        } else if (document.selection) {
            var selection = document.selection.createRange().text;
            if(selection.trim() > ''){
                return selection;
            }
        }
        return '';
    } ;
	
	
	   

	});
	