class QueryError extends Error {
	constructor(message: string) {
		super(message); // (1)
		this.name = "Query_Error"; // (2)
	}
}
  
function test() {
	throw new QueryError("Query unsuccessful");
}
  
try {
	test();
} catch(err) {
	if (err instanceof QueryError) {
		console.error(err.message); // Whoops!
		console.error(err.name); // ValidationError
		console.error(err.stack); // a list of nested calls with line numbers for each
	}
}