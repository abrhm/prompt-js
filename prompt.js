define([], function()
{
	return class Prompt {
		constructor(params) {
			if (params.constructor != Object) {
				throw new TypeError("Input parameter must be an Object!");
			}

			this.callback = params.callback;
			this.creator = params.create || {};
			this.initialized = false;
			// Initialize the prompts and get a local reference to it
			this.prompts = [];
			var prompts = this.prompts;

			if (params.prompts === 'undefined' || params.prompts.constructor != Array){
				throw new TypeError("Prompts must be an Array!");
			}

			params.prompts.forEach(function(element, idx) {
				var type = element.type || String;
				prompts[idx] = {};
				prompts[idx].type = type;
				prompts[idx].message = element.message;
				prompts[idx].initial = element.initial || new type();
				prompts[idx].regex = element.regex || new RegExp('(.*)');
				prompts[idx].validator = element.validator || (function(value){ return true; });
				prompts[idx].value = new type();
			});
		}

		read(element) {
			var input;
			var value;
			var match = null;
			var valid = false;

			do {
				// Read the value with the input
				input = this.callback(element.message, element.initial, element.type);
				// Match against the regex
				match = element.regex.exec(input);
				try {
					// Convert if possible
					value = new element.type(input);
					// Run the validator
					valid = element.validator(value);
				}
				catch (err) {
					alert(err.message);
				}
			} while(match == null || !valid);
			// Set the value if valid
			element.value = value;
		}

		readAll() {
			var that = this;
			this.prompts.forEach(function(el){
				that.read(el);
			});
			this.initialized = true;
		}

		create() {
			if (!this.initialized) {
				this.readAll();
			}
			var values = this.prompts.map(function(element) {
				return element.value;
			});

			return new this.creator(...values);
		}
	}
});
