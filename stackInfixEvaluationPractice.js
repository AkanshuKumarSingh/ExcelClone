// // to evaluate formula using infix evaluation.
function evaluateFormulaAns(ipString) {
    let oStack = [];
    let vStack = [];

    for (let i = 0; i < ipString.length; i++) {
        let char = ipString[i];
        if(char == " "){
            continue;
        }else if(char >= 0 && char <= 9){
            let j = i+1;
            while(ipString[j] >= 0 && ipString[j] <= 9){
                j++;
            }
            vStack.push(ipString.substring(i,j));
            i = j-1;
        }else if(char == "("){
            oStack.push(char);
        }else if(char == ")"){
            while(oStack[oStack.length-1] != "("){
                let val2 = vStack.pop();
                let val1 = vStack.pop();
                let op = oStack.pop();
                let val = value(val1,val2,op);
                vStack.push(val);
            }
            oStack.pop();
        }else{
            while(oStack.length > 0 && oStack[oStack.length-1] != "(" && priority(oStack[oStack.length-1]) >= priority(char)){
                let op = oStack.pop();
                let val2 = vStack.pop();
                let val1 = vStack.pop();
                let val = value(val1,val2,op);
                vStack.push(val);
            }
            oStack.push(char);
        }
        
    }
	while (oStack.length > 1) {
        let op = oStack.pop();
        let val2 = vStack.pop();
        let val1 = vStack.pop();

        let res = value(val1, val2, op);
        vStack.push(res);
    }


    return vStack.pop();
}

function value(val1,val2,op) {
    val1 = Number(val1);
    val2 = Number(val2);
    if(op == "+"){
        return val1 + val2;
    }else if(op == "-"){
        return val1 - val2;
    }else if(op == "*"){
        return val1 * val2;
    }else if(op == "/"){
        return val1/val2;
    }else{
        return 0;
    }
}

function priority(op) {
    if (op == '*' || op == '/') {
        return 2;
    } else if (op == '+' || op == '-') {
        return 1;
    } else {
        return 0;
    }
}
