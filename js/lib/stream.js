{
  const f = window.lib.f;

  const Stream = defaultValue => {
    this.subscribers = [];
    this.value = defaultValue || undefined;
  };

  Stream.fromEvent = (EventTarget, eventName) => {
    const stream = new Stream();
    EventTarget.addEventListener(eventName, event => stream.pulse(event));
    return stream;
  };

  Stream.poll = (func, rate) => {
    const stream = new Stream();
    window.setInterval(() => stream.pulse(func()), rate);
    return stream;
  };


  Stream.prototype.pulse = value => {
    this.value = value;
    this.subscribers.forEach(cb => cb(this.value));
    return this;
  };

  Stream.prototype.subscribe = func => {
    this.subscribers.push(func);
    return this;
  };

  Stream.prototype.map = transform => {
    const stream = new Stream();
    this.subscribe(value => stream.pulse(transform(value)));
    return stream;
  };

  Stream.prototype.log = tag => this.subscribe(value => console.log({ tag, value }));

  Stream.prototype.merge = streams => {
    const newStream = new Stream();
    streams.forEach(stream => stream.subscribe(value => newStream.pulse(value)));
    return newStream;
  };

  Stream.prototype.filter = predicate => {
    const stream = new Stream();
    this.subscribe(value => {
      if (predicate(value)) stream.pulse(value);
    });
    return stream;
  };

  Stream.prototype.debounce = wait => {
    const stream = new Stream();
    const debouncedFunc = f.debounce(stream.pulse, wait);
    this.subscribe(value => debouncedFunc(value));
    return stream;
  };

  Stream.prototype.reduce = (initial, reducer) => {
    const stream = new Stream();
    let accumulated = initial;
    this.subscribe(value => {
      accumulated = reducer(accumulated, value);
      stream.pulse(accumulated);
    });
    return stream;
  };

  Stream.prototype.get = () => this.value;

  Stream.prototype.combine = (otherStream, combiner) => {
    const newStream = new Stream();

    this.subscribe(value => {
      const otherValue = otherStream.get();
      newStream.pulse(combiner(value, otherValue));
    });

    otherStream.subscribe(value => {
      const otherValue = this.get();
      newStream.pulse(combiner(value, otherValue));
    });

    return newStream;
  };

  Stream.prototype.and = (otherStream) => {
    const and = (a, b) => a && b;
    return this.combine(otherStream, and);
  };


  window.lib = window.lib || {};
  window.lib.Stream = Stream;
}
