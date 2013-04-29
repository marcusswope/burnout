var Burnout = Burnout || {};

Burnout.TextPropertyBinder = function (model, property, input) {
    var self = this;
    self._model = model;
    self._property = property;
    self._input = input;
    self._handlers = [];
    var handlerFunction = self._model[self._property + 'Changed'];
    if (typeof handlerFunction === "function") {
        self._handlers.push(handlerFunction);
    }
};

Burnout.TextPropertyBinder.prototype = (function () {

    function canBind() {
        return this._property === this._input.attr('name');
    };

    function bind() {
        var self = this;

        self._input.val(self._model[self._property]);
        self._input.change(function () {
            if (!self._updating) {
                self._updating = true;
                var oldValue = self._model[self._property];
                self._model[self._property] = self._input.val();
                propagate(oldValue, self);

                $('#objectJson').text(self._input.val());
            }
            self._updating = false;
        });

        tent.changes.bind(self._model, function (changes) {

            if (changes.eventType === tent.changes.EventTypes.CHANGED) {
                if (!self._updating) {
                    self._updating = true;
                    self._input.val(changes.data.current);
                    propagate(changes.data.oldValue, self);
                }
                self._updating = false;
            }
        });

        updateInput(self, self._model[self._property]);
    };

    function propagate(oldValue, self) {
        self._handlers.forEach(function (handler) {
            handler({
                newValue: self._input.val(),
                oldValue: oldValue
            });
        });
    }

    function updateInput(self, newValue) {
        self._input.val(newValue);
    }

    return {
        constructor: Burnout.TextPropertyBinder,
        canBind: canBind,
        bind: bind
    };
})();

Burnout.ModelBinder = function (form, model) {
    var self = this;
    self.form = form;
    self.model = model;
};

Burnout.ModelBinder.prototype = (function () {

    var propertyBinders = [
        function (model, property, input) { return new Burnout.TextPropertyBinder(model, property, input); }
    ];

    function bind() {
        var self = this;

        $(this.form).children(':input').each(function () {
            var input = $(this);
            for (var property in self.model) {
                propertyBinders.forEach(function (binderBuilder) {
                    var binder = binderBuilder(self.model, property, input);
                    if (binder.canBind()) {
                        binder.bind();
                    }
                });
            }
        });
    };

    return {
        constructor: Burnout.ModelBinder,
        bind: bind
    };
})();