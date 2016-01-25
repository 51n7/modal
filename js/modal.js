// Create an immediately invoked functional expression to wrap our code
(function() {

	// Define constructor
	this.Modal = function() {

		// Create global element references
		this.closeButton = null;
		this.modal = null;
		this.content = null;
		this.push = null;
		this.footer = null;
		this.overlay = null;

		// Determine transition prefix
		this.transitionEnd = transitionSelect();

		// Define option defaults
		var defaults = {
			title: "default title",
			content: "default content",
			escapeClose: true,
			buttonClose: true,
			overlayClose: true,
			buttons: [
				{
					type: "success",
					label: "Primary",
					id: "success",
					className: "",
					link: "#success"
				},{
					type: "secondary",
					label: "Secondary",
					id: "secondary",
					className: "",
					link: "#secondary"
				}
			]
		}

		// Create options by extending defaults with the passed in arugments
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extend({}, defaults, arguments[0]);
		}

	}

	// Public Methods
	Modal.prototype.open = function() {
		buildModal.call(this);
		initializeEvents.call(this);

		window.getComputedStyle(this.modal).height;
		window.getComputedStyle(this.footer).height;

		// create sticky footer for mobile
		this.content.style.margin = "0 auto -" + this.footer.offsetHeight + "px";
		this.push.style.height = this.footer.offsetHeight + "px";

		// lock scrolling the actual page
		document.querySelector('body').style.overflow = "hidden";

		// add class to begin animation and open modal
		this.modal.className = this.modal.className + " modal-open";
	}

	Modal.prototype.close = function() {
		var _ = this;

		// remove class and close modal
		this.modal.className = this.modal.className.replace(" modal-open", "");

		// unlock scrolling the actual page
		document.querySelector('body').style.overflow = "";

		// when transitions are done, remove elements
		this.modal.addEventListener(this.transitionEnd, function() {
			if(_.modal.parentNode) _.modal.parentNode.removeChild(_.modal);
		});

		this.overlay.addEventListener(this.transitionEnd, function() {
			if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
		});

	}

	// Private Methods
	function buildModal() {

		var wrapper, header, content, footer, docFrag;

		if (typeof this.options.content === "string") {
			content = this.options.content;
		} else {
			content = this.options.content.innerHTML;
		}

		// Create a DocumentFragment to build with
		docFrag = document.createDocumentFragment();

		// Create modal wrapper element
		this.modal = document.createElement("div");
		this.modal.className = "modal-wrapper";
		this.modal.style.display = "block";

		// Create modal element
		wrapper = document.createElement("div");
		wrapper.className = "modal";
		this.modal.appendChild(wrapper);
		
		// Create header and append to modal
		header = document.createElement("div");
		header.className = "modal-header";
		header.innerHTML = "<h3>"+this.options.title+"</h3>";
		wrapper.appendChild(header);

		// If closeButton option is true, add a close button
		if (this.options.buttonClose === true) {
			this.closeButton = document.createElement("button");
			this.closeButton.className = "modal-close";
			header.appendChild(this.closeButton);
		}

		// Create content area and append to modal
		this.content = document.createElement("div");
		this.content.className = "modal-content";
		this.content.innerHTML = content;
		wrapper.appendChild(this.content);

		// add push for sticky footer on mobile
		this.push = document.createElement("div");
		this.push.className = "push";
		this.content.appendChild(this.push);

		// Create footer and append to modal
		this.footer = document.createElement("div");
		this.footer.className = "modal-footer";
		wrapper.appendChild(this.footer);

		// Iterate over buttons
		var buttonObj = this.options.buttons;
		for (var property in buttonObj) {  
		    if (buttonObj.hasOwnProperty(property)) {

				// Create buttons
				var btn       = document.createElement("a");
				btn.href      = buttonObj[property].link;
				btn.id        = buttonObj[property].id;
				btn.className = "button " + buttonObj[property].type + " " + buttonObj[property].className;
				btn.innerHTML = buttonObj[property].label;
				this.footer.appendChild(btn);
		    }
		}

		// Add overlay
		this.overlay = document.createElement("div");
		this.overlay.className = "modal-overlay";
		this.modal.appendChild(this.overlay);
		
		// Append modal to DocumentFragment
		docFrag.appendChild(this.modal);

		// Append DocumentFragment to body
		document.body.appendChild(docFrag);

	}

	function initializeEvents() {

		var _ = this;
		
		if (this.closeButton) {
			this.closeButton.addEventListener('click', this.close.bind(this));
		}

		if (this.overlay && this.options.overlayClose == true) {
			this.overlay.addEventListener('click', this.close.bind(this));
		}

		// close modal when escape is pressed
		if (this.options.escapeClose === true) {
			document.onkeydown = function(e) {
				if (e.keyCode == 27) {
					_.close();
				}
			};
		}

	}

	function extend(target) {

		for(var i=1; i<arguments.length; ++i) {
			var from = arguments[i];

			if(typeof from !== 'object') continue;

			for(var j in from) {
				if(from.hasOwnProperty(j)) {

					// if property is not HTML node
					if (from[j].nodeType !== 1) {
						target[j] = typeof from[j] === 'object'
						? extend({}, target[j], from[j])
						: from[j];
					} else {
						target[j] = from[j];
					};
				}
			}			
		}

		return target;
	}

	function transitionSelect() {
		var el = document.createElement("div");
		if (el.style.WebkitTransition) return "webkitTransitionEnd";
		if (el.style.OTransition) return "oTransitionEnd";
		return 'transitionend';
	}

}());