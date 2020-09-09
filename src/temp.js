let array = ['a','b','c','d','f'];

function findMissingLetter(array){
	return String.fromCharCode(array.map((v,i,a) => a[i].charCodeAt(0)).filter((v,i,a) => (v != a[i+1] - 1))[0] + 1);
}


console.log(findMissingLetter(array));