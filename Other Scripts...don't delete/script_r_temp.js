		//import Board  from "board.js";
		
		var prevClicked;
		var prevClick;
		var currentpossibleMove=[];
		var prevpossibleMove=[];
		var thisClick=0;
		var capture=[];
		var move =[];
		var AutoAI = false;
		var understanding_mode = false;
		var startGame = false;
		var quitGame = false;

		var board =  new Board(true, true);
		
		
		board.board[3][2] = 0;
		board.board[4][3] = 1;
		board.board[5][4] = -1;
		board.board[6][5] = 0;
		board.board[7][6] = -1;
		board.board[1][2] = 0;
		board.board[1][4] = 0;
		//board.board[1][6] = 0;
		board.board[1][8] = 0;
		board.board[2][1] = 0;
		board.board[2][3] = 0;
		board.board[2][5] = 0;
		board.board[2][7] = 0;
		board.board[3][4] = 0;
		board.board[3][6] = 0;
		//board.board[3][8] = 0;
		
		//board.board[5][4] = -1;
		
		
		board.print_board();
		
		var ai_class = "blackPiece"; var player_class="redPiece";
		var is_red_top = true;
		var ai_turn = false;

		if(board.is_ai_red)
		{
			ai_class = "redPiece";
			player_Class = "blackPiece";
			ai_turn = true;
		}

		//to check the condition for game finished, is anyone won the meatch?
		displayMessage();
		
		$(document).ready(function()
		{
			render_board(board);
			//below function to hide and show the options on a perticular mode
			$('input[type="radio"]').click(function(){
				var inputValue = $(this).attr("value");
				//console.log(inputValue);
				var targetBox = $("." + inputValue+"_1");
				//console.log(targetBox);
				$(".box").not(targetBox).hide();
				$(targetBox).show();
			});
			//to make the pieces clickable
			$("td").click(clickable);
		    	//$("td").click(clickable);
		    	
		    });


		
		function render_board(board)
		{
				//to render the board 

        		/*
            	we will use 1-based indexing for knowing the cell state of the 8X8 board like board[1][1]
            	Following numbers are used to define state of a particular cell of the board
            	 0 empty cell(having no piece)  
            	-1 black piece
            	 1 red piece
            	-2 black king piece
            	 2 red king piece
            	 3 restricted cell(pieces can't jump on)
            	 4 possible Moves cell(cell having no piece but)
            	 */
            	 board.print_board();
            	 
            	 for (var i = 1; i <= 8; i++) 
            	 {
            	 	var x = i;
            	 	for (var j = 1; j <= 8; j++) 
            	 	{
            	 		var y=j;
            	 		cell = x*10 +y;
						//console.log(board[i][j]);
						if((i+j)%2 != 0)
						{
						//red piece
							if (board.board[i][j] == 1)
							{

								var pieceClass = $("#"+cell).children("p").attr('class');
								if(pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove"  )
								{
									$("#"+cell).children("p").addClass("redPiece");
									$("#"+cell).children("p").removeClass("noPiece possibleMove");


								}

								else
								{	
									$("#"+cell).children("p").removeClass("noPiece");
									$("#"+cell).children("p").addClass("redPiece");
								}
							}

							//red king piece

							else if(board.board[i][j] == 2)
							{
								//if condition to hide the possible moves if clicked anywhere else
								var pieceClass = $("#"+cell).children("p").attr('class');
								if(pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove"  )
								{
									$("#"+cell).children("p").addClass("redKingPiece");
									$("#"+cell).children("p").removeClass("noPiece possibleMove");

								
								}
								else
								{
									$("#"+cell).children("p").removeClass("noPiece");
									$("#"+cell).children("p").addClass("redKingPiece");
								}	

							}	 

							//black piece
							else if (board.board[i][j] == -1) 
							{
								//console.log("red");
								var pieceClass = $("#"+cell).children("p").attr('class');
								if(pieceClass == "possibleMove" || pieceClass == "noPiece possibleMove"  )
								{
									$("#"+cell).children("p").addClass("blackPiece");
									$("#"+cell).children("p").removeClass("noPiece possibleMove");

								}
								else
								{	
									$("#"+cell).children("p").removeClass("noPiece");
									$("#"+cell).children("p").addClass("blackPiece");
								}
							}

							//black king piece
							//showing possible moves for the AI is not required for now
							//so not covered
							else if( board.board[i][j] == -2)
							{
								$("#"+cell).children("p").removeClass("noPiece");
								$("#"+cell).children("p").addClass("blackKingPiece");


							}

							//no Piece or empty cell
							else if (board.board[i][j] == 0)
							{
								//console.log("no");
								var pieceClass = $("#"+cell).children("p").attr('class');

								if(pieceClass ==  "redPiece" )
								{
									$("#"+cell).children("p").removeClass("redPiece");
									$("#"+cell).children("p").addClass("noPiece");
								}
								else if(pieceClass ==  "redKingPiece")
								{
									$("#"+cell).children("p").removeClass("redKingPiece");
									$("#"+cell).children("p").addClass("noPiece");
								}
								else if(pieceClass ==  "blackKingPiece")
								{	
									$("#"+cell).children("p").removeClass("blackKingPiece");
									$("#"+cell).children("p").addClass("noPiece");
								}
								else if (pieceClass ==  "blackPiece") 
								{
									$("#"+cell).children("p").removeClass("blackPiece");
									$("#"+cell).children("p").addClass("noPiece");	

								}
								else if(pieceClass ==  "possibleMove" || pieceClass ==  "noPiece possibleMove")
								{	
									$("#"+cell).children("p").removeClass("possibleMove");
									$("#"+cell).children("p").addClass("noPiece");	
								}

							}

							//this condition checked for possible move pieces
							/*
							else if (board.board[i][j] == 4)
							{
								
								var pieceClass = $("#"+cell).children("p").attr('class');
								//console.log("hey 4")
								//console.log(pieceClass);
								if(pieceClass == undefined || pieceClass == "noPiece")
								{
									if(pieceClass == "noPiece")
										$("#"+cell).children("p").removeClass("noPiece");
									$("#"+cell).children("p").addClass("possibleMove");

								}
								else if(pieceClass == "possibleMove")
								{
									$("#"+cell).children("p").removeClass("possibleMove");
									$("#"+cell).children("p").addClass("noPiece");	
								}



							}*/
							else
								continue;

						}
					}						
				}
			};
			
			function clickable()
			{
				
				//!ai_turn implies its black turn
				console.log("++++++++++++++\n")
				console.log(board.is_game_finished());
				console.log("++++++++++++++\n")
				if(board.is_game_finished())
				{
					displayMessage();
				}
				if(startGame && !ai_turn)
				{	
					
					prevpossibleMove =0;
					
					if(thisClick == 0)
					{	
						
						console.log("its User Turn")
						thisClick= this;
						var i = Math.floor(thisClick.id / 10);
						var j = thisClick.id%10;
						currentpossibleMove = board.get_moves_of_piece(i, j);

						if (board.board[i][j] == 1)
						{
							currentpossibleMove = board.get_moves_of_piece(i, j);
							displaypossibleMove(currentpossibleMove);
							render_board(board);
							console.log("red-1");

						}
						else if(board.board[i][j] == 2)
						{
							
							currentpossibleMove = board.get_moves_of_piece(i, j);
							displaypossibleMove(currentpossibleMove);
							render_board(board);							
							displayMessage();
							console.log("redKingPiece-1");

						}	 

						else if (board.board[i][j] == -1) 
						{
							
							
							console.log("black when red-1");
						}
						else if( board.board[i][j] == -2)
						{
							
							console.log("blackKing when red-1");
						}
						else if (board.board[i][j] == 0)
						{
							
							console.log("noPiece when red-1");
						}
						else
						{
							
							console.log("blankPiece-1");
						}

					}	

					
					else
					{
						//prevpossibleMove =0;
						//currentpossibleMove=0;
						console.log("else_Start*********");
						prevClick = thisClick;
						prevpossibleMove = currentpossibleMove;
						thisClick = this;
						var curr_i = Math.floor(thisClick.id / 10);
						var curr_j = thisClick.id%10;
						var prev_i = Math.floor(prevClick.id / 10);
						var prev_j = prevClick.id%10;
						move ={from_row:prev_i,from_col:prev_j,to_row:curr_i,to_col:curr_j ,captures:0};
						is_even = (curr_i + curr_j)%2;

							
							
							if(board.board[curr_i][curr_j] == 4)	
							{	

								console.log("#######241#######\n\n");
								console.log("!!!!!prevClick!!!!!! "+prevClick.id);
								console.log("!!!!!thisClick!!!!!!"+thisClick.id);
								render_board(board);
								ai_turn = true;
								//displayMessage();

								if(!AutoAI)
								{ 
									console.log("helo");
									thisClick =0;
									prevClick = 0;

									setTimeout(() => {  handle_ai_turn(); }, 1000);
									//ai_turn = true; 
								}
								else
								{
									console.log("Hiii")
									thisClick =0;
									prevClick = 0;

									setTimeout(() => {  handle_ai_turn(); }, 1000);
								}

							}
							else
								ai_turn = false;

							if (board.board[curr_i][curr_j] == 1)
							{
							
								console.log("!!!!!prevClick!!!!!! "+prevClick.id);
								console.log("!!!!!thisClick!!!!!!"+thisClick.id);

								hidePrevpossibleMove(prevpossibleMove);
								render_board(board);
								//board.print_board();
								currentpossibleMove = board.get_moves_of_piece(curr_i, curr_j);
								displaypossibleMove(currentpossibleMove);

								render_board(board);
								//displayMessage();
								console.log("redPiece-2");

							}
							
							else if(board.board[curr_i][curr_j] == 2)
							{
								console.log("redKingPiece-2");
								console.log("!!!!!prevClick!!!!!! "+prevClick.id);
								console.log("!!!!!thisClick!!!!!!"+thisClick.id);

								hidePrevpossibleMove(prevpossibleMove);
								render_board(board);
								
								currentpossibleMove = board.get_moves_of_piece(curr_i, curr_j);
								displaypossibleMove(currentpossibleMove);

								render_board(board);
								displayMessage();
							

							}	 
							else if(board.board[curr_i][curr_j] == 4)
							{
							
								console.log("#######242#######\n\n");
								console.log("!!!!!prevClick!!!!!! "+prevClick.id);
								console.log("!!!!!thisClick!!!!!!"+thisClick.id);

								hidePrevpossibleMove(prevpossibleMove);
								if(curr_i == 8 && board.board[prev_i][prev_j] == 1)
								{
									board.board[curr_i][curr_j]=2;
									board.board[prev_i][prev_j] = 0;
								}	

								else if(curr_i!=prev_i && curr_j != prev_j)
								{
									//possibility of bug
									if(board.board[prev_i][prev_j] == 2)
									{
										board.board[curr_i][curr_j] = 2;
										board.board[prev_i][prev_j] = 0;
									}
									if(board.board[prev_i][prev_j] == 1)
									{
										board.board[curr_i][curr_j] = 1;
										board.board[prev_i][prev_j] = 0;

									}

								}
							

								var captures=[];
								for (var i = 0; i < currentpossibleMove.length; i++)
								{
									if (currentpossibleMove[i]['to_row'] == curr_i && currentpossibleMove[i]['to_col'] == curr_j) 
									{
										captures = currentpossibleMove[i].captures;
									}
								}
								hideCapturedPiece(captures);
							
								render_board(board);
							
							}	 

							else if (board.board[curr_i][curr_j] == -1) 
							{
								console.log("black when red-2");
								if(prevpossibleMove != currentpossibleMove)
								{
									hidePrevpossibleMove(prevpossibleMove);
									render_board(board);
								}

							}
							else if( board.board[curr_i][curr_j] == -2)
							{
								console.log("blackKing when red-2");

								if(prevpossibleMove != currentpossibleMove)
								{
									hidePrevpossibleMove(prevpossibleMove);
									render_board(board);
								}

							}
							else if (board.board[curr_i][curr_j] == 0)
							{
								console.log("noPiece when red-2");
								if(prevpossibleMove != currentpossibleMove)
								{
									hidePrevpossibleMove(prevpossibleMove);
									render_board(board);
								}

							}
							else if(board.board[curr_i][curr_j] == 3)
							{
								console.log("blankPiece when red-2");
								if(prevpossibleMove != currentpossibleMove)
								{
									hidePrevpossibleMove(prevpossibleMove);
									render_board(board);
								}

							}

							if(ai_turn)
							{	
								$("#RedTurn").css("opacity",".5");
								$("#BlackTurn").css("opacity","1.0");
							}

												

					}

				}

				else if(!startGame)
				{	
					alert("Press \"Play\" button to start the game ");

				}

				else
				{
					console.log("pata nahi g");
					displayMessage();
				}	
				
				
				
		};		

function displayMessage()
{
	console.log("pata nahi g 2");
	if(board.is_game_finished())
	{
		syncWait(1000);
		console.log("inside if");
		
		if(board.has_won())
		{

			console.log("someone WOn");
			if(!alert("AI has won!!"))
			{	
				console.log("AI Won");
				window.location.reload();
				
			}
		}
			
		else if(board.has_lost())
		{	
			console.log("You Won");
			if(!alert("You won!!"))
				window.location.reload();
		}
		
	}
};


			