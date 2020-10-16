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

/* 암호화 하는 부분 */
function playfairCipher(key, plainText){
    var arr = [];
    var encArr = [];
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    var encResult = "";

    document.getElementById("playFair").value = "";

    /* 글이 반복되면 x 문자를 추가해 준다 */
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

    /* 쌍자 암호의 각각 위치를 확인해 준다 */
    for(var i = 0; i < arr.length; i++) {
        var tmp = [];

        for(var j = 0; j < board.length; j++) { 
            for(var k = 0; k<board[j].length; k++) {
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

        /* 행이 같은 경우 */
        if(x1 == x2) { 
            tmp[0] = board[x1][(y1+1)%5];
            tmp[1] = board[x2][(y2+1)%5];
        /* 열이 같은 경우 */
        } else if(y1==y2) {
            tmp[0] = board[(x1+1)%5][y1];
            tmp[1] = board[(x2+1)%5][y2];
        /* 행과 열이 모두 다른 경우 */
        } else { 
            tmp[0] = board[x2][y1];
            tmp[1] = board[x1][y2];
        }

        encArr.push(tmp);
    }

    for(var i = 0; i < encArr.length; i++) {
        encResult += encArr[i][0] + encArr[i][1]+" ";
    }

    return encResult;
}

function DoubleDecryption(key, enStr) {
    /* 바꾸기 전의 쌍자 암호를 저장할 변수를 선언해 준다 */
    var arr = []; 
    /* 바꾼 후의 쌍자 암호를 저장할 변수를 선언해 준다 */
    var decArr = []; 
    /* 쌍자 암호 두 글자 각각의 행과 열의 값을 저장할 변수를 선언해 준다 */
    var x1 = 0 , x2 = 0 , y1=0, y2=0; 
    var decResult = "";

    for(var i = 0; i < enStr.length; i++) {
        var twoWord = [];
        twoWord[0] = enStr.charAt(i);
        twoWord[1] = enStr.charAt(++i);
        arr.push(twoWord);
    }

    for(var i = 0; i < arr.length; i++) {
    var tmp = [];

        for(var j = 0; j < board.length; j++) {
            for(var k = 0 ; k < board[j].length; k++)  {
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

        if(x1 == x2) { 
            tmp[0] = board[x1][(y1 + 4) % 5];
            tmp[1] = board[x2][(y2 + 4) % 5];
        } else if(y1==y2) {
            tmp[0] = board[(x1 + 4) % 5][y1];
            tmp[1] = board[(x2 + 4) % 5][y2];
        } else { 
            tmp[0] = board[x2][y1];
            tmp[1] = board[x1][y2];
        }
        decArr.push(tmp);
    }

    for(var i = 0; i < decArr.length; i++) { 
        if(i != decArr.length - 1 && decArr[i][1] == 'x' && decArr[i][0] == decArr[i + 1][0]) {	
            decResult += decArr[i][0];
        } else if(i == decArr.length - 1 && decArr[i][1] == 'x') {
            decResult += decArr[i][0];
        } else {
            decResult += decArr[i][0]+decArr[i][1];
        }
    }

    /* z 위치를 찾아서 q 로 돌려 놓는다 */
    for(var i = 0; i < zCheck.length; i++) {
        for(var j = 0; j < decResult.length; j++) {
            if(zCheck[i] == j) {
                decResult = decResult.substring(0, j) + "z" + decResult.substring(j + 1, decResult.length);
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

/* Caps Lock 감지 */
var input = document.getElementById("key");
var inputText = document.getElementById("plainText");

input.addEventListener("keyup", function(event) {
    if (event.getModifierState("CapsLock")) {
        Swal.fire({
            icon: 'error',
            title: 'Caps Lock',
            text: '입력을 하실 때에는, Caps Lock 키를 풀고 해 주시길 바랍니다.',
            confirmButtonColor: "#626BCD",
            confirmButtonText: '돌아가기'
        });
    }
});

inputText.addEventListener("keyup", function(event) {
    if (event.getModifierState("CapsLock")) {
        Swal.fire({
            icon: 'error',
            title: 'Caps Lock',
            text: '입력을 하실 때에는, Caps Lock 키를 풀고 해 주시길 바랍니다.',
            confirmButtonColor: "#626BCD",
            confirmButtonText: '돌아가기'
        });
    }
});