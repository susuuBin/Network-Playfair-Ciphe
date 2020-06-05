var board = [];
board[0] = []; 
board[1] = [];
board[2] = [];
board[3] = [];
board[4] = [];
var result = "";
var blankCheck = [], zCheck = [];

function init() {
    /* cipher.html 의 암호키와 평문을 받아와 준다. */
    var key = document.getElementById("key").value;
    var plainText = document.getElementById("plainText").value;
    var b = 0, z = 0;
    window.blankCheck = [];
    window.zCheck = [];

    /* Board Setting */
    setBoard(key);

    /* 공백을 제거해 준다. */
    for (var i = 0; i < plainText.length; i++) {
        if (plainText.charAt(i) == ' ') {
            plainText = plainText.substring(0, i) + plainText.substring(i + 1, plainText.length);
            blankCheck[b] = i;
            b++;
        }
    }

    /* 사용자가 z를 입력해 주었다면, q로 바꾸어 줘서 처리해 준다. */
    for (var i = 0; i < plainText.length; i++) {
        if (plainText.charAt(i) == 'z') {
            zCheck[z] = i;
            z++;
            plainText = plainText.substring(0, i) + 'q' + plainText.substring(i + 1, plainText.length);
        }
    }
    
    encryption = playfairCipher(key, plainText);

    /* 암호문을 출력해 준다. */
    document.getElementById("cypherText").value = encryption;

    /* 공백을 제거해 준다. */
    for (var i = 0; i < encryption.length ; i++ ) {
        if (encryption.charAt(i) == ' ')
            encryption = encryption.substring(0, i) + encryption.substring(i + 1, encryption.length);
    }

    decryption = DoubleDecryption(key, encryption);

    for(var i = 0; i < blankCheck.length; i++) {
        for(var j = 0; j < decryption.length; j++) {
            if(blankCheck[i] == j) {
                decryption = decryption.substring(0, j) + " " + decryption.substring(j, decryption.length);
                blankCheck[i + 1] += i + 1;
            }
        }
    }
    
    /* 복호문을 출력해 준다. */
    document.getElementById("decryText").value = decryption;
    return false;
}

function playfairCipher(key, plainText){
    var arr = [];
    var encArr = [];
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    var encResult = "";

    document.getElementById("playFair").value = "";

    for(var i = 0; i < plainText.length; i++) { 
        var twoWord = [];
        twoWord[0] = plainText.charAt(i);
        if(plainText.charAt(i)==plainText.charAt(i+1)) { 
            twoWord[1] = 'x';
        } else if(i == plainText.length-1) {
            twoWord[1] = 'x';
        } else {
            twoWord[1] = plainText.charAt(i+1);
            i++;
        }
        arr.push(twoWord);
        document.getElementById("playFair").value += twoWord[0] + twoWord[1] + " ";
    }

    for(var i=0; i<arr.length; i++) {
        var tmp = [];

        for(var j=0; j<board.length; j++) { 
            for(var k=0; k<board[j].length; k++) {
                if(board[j][k] == arr[i][0]) {
                    x1 = j;
                    y1 = k;
                }
                if(board[j][k] == arr[i][1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }
        
        if(x1==x2) { 
            tmp[0] = board[x1][(y1+1)%5];
            tmp[1] = board[x2][(y2+1)%5];
        } else if(y1==y2) {
            tmp[0] = board[(x1+1)%5][y1];
            tmp[1] = board[(x2+1)%5][y2];
        } else { 
            tmp[0] = board[x2][y1];
            tmp[1] = board[x1][y2];
        }

        encArr.push(tmp);
    }
    
    for(var i=0; i<encArr.length; i++) {
        encResult += encArr[i][0]+encArr[i][1]+" ";
    }

    return encResult;
}

function DoubleDecryption(key, enStr) {
    var arr = []; 
    var decArr = []; 
    var x1=0 , x2=0 , y1=0, y2=0; 
    var decResult = "";
    
    for(var i=0; i<enStr.length; i++) {
        var twoWord = [];
        twoWord[0] = enStr.charAt(i);
        twoWord[1] = enStr.charAt(++i);
        arr.push(twoWord);
    }

    for(var i=0; i<arr.length; i++) {
    var tmp = [];

        for(var j=0; j<board.length; j++) {
            for(var k=0 ; k<board[j].length; k++)  {
                if(board[j][k] == arr[i][0]) {
                    x1 = j;
                    y1 = k;
                }
                if(board[j][k] == arr[i][1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }
        
        if(x1==x2) { 
            tmp[0] = board[x1][(y1+4)%5];
            tmp[1] = board[x2][(y2+4)%5];
        } else if(y1==y2) {
            tmp[0] = board[(x1+4)%5][y1];
            tmp[1] = board[(x2+4)%5][y2];
        } else { 
            tmp[0] = board[x2][y1];
            tmp[1] = board[x1][y2];
        }
        decArr.push(tmp);
    }
    
    for(var i=0; i<decArr.length; i++) { 
        if(i != decArr.length-1 && decArr[i][1]=='x' && decArr[i][0]==decArr[i+1][0]) {	
            decResult += decArr[i][0];
        } else if(i == decArr.length-1 && decArr[i][1]=='x') {
            decResult += decArr[i][0];
        } else {
            decResult += decArr[i][0]+decArr[i][1];
        }
    }
    for(var i=0; i<zCheck.length; i++) {
        for(var j=0; j<decResult.length; j++) {
            if(zCheck[i] == j) {
                decResult = decResult.substring(0, j) + "z" + decResult.substring(j+1, decResult.length);
            }
        }
    }

    return decResult;
}

function setBoard(alphabetKey) {
    /* 중복된 문자가 제거된 문자열을 저장할 문자열 */
    var keyLengthCount = 0;
    /* 문자 중복을 체크해 주기 위한 Flag 변수 */
    var duplicationFlag = false;
    result = "";

    /* 키에 모든 알파벳을 추가해 준다. */
    alphabetKey += "abcdefghijklmnopqrstuvwxyz";

    /* 중복을 처리해 준다. */
    for(var i = 0; i < alphabetKey.length; i++) {
		for(var j = 0; j < result.length; j++) {
			if(alphabetKey.charAt(i) == result.charAt(j)) {
				duplicationFlag = true;
				break;
			}
		}
		if(!duplicationFlag) result += alphabetKey.charAt(i);
		duplicationFlag = false;
    }

    /* 배열에 대입해 준다. */
	for(var i = 0; i < board.length; i++) {
		for(var j = 0; j < 5; j++) {
            board[i][j] = result.charAt(keyLengthCount++);
            document.getElementById(keyLengthCount).innerHTML = board[i][j];
		}
    }

    return false;
}