require.config({
	paths: {
		jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
		prompt: "prompt",
	}
});

require(["jquery", "prompt"], function($, Prompt)
{
	class Person {
		constructor(name, age) {
			this.name = name;
			this.age = age;
		}
	}

	class PersonPrompt extends Prompt {
		constructor(params) {
			super({
				callback: function(message, def, type){ return prompt(message, def); },

				prompts: [
					{
						message: "Your name:",
						type: String,
						initial: "Name...",
						regex: new RegExp(/(\S+)/),
					},
					{
						message: "Age:",
						type: Number,
						regex: new RegExp(/(\d+)/),
						validator: (function(value) { return (value >= 1 && value < 120); }),
					},
				],

				create: Person,
			});
		}

		create() {
			return super.create();
		}
	}

	$("#button").click(function()
	{
		var personPrompt = new PersonPrompt();
		var person = personPrompt.create();
		var node = document.createElement("p");
		node.innerHTML += "Name: " + person.name + "</br>";
		node.innerHTML += "Age: " + person.age;
		document.body.appendChild(node);
	});




});
