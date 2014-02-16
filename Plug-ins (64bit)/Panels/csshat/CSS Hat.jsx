function h(a) {
  throw a;
}
var l = void 0,
    m = !0,
    o = null,
    p = !1;

function aa(a) {
  var b = typeof a;
  if ('object' == b) if (a) {
    if (a instanceof Array) return 'array';
    if (a instanceof Object) return b;
    var c = Object.prototype.toString.call(a);
    if ('[object Window]' == c) return 'object';
    if ('[object Array]' == c || 'number' == typeof a.length && 'undefined' != typeof a.splice && 'undefined' != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('splice')) return 'array';
    if ('[object Function]' == c || 'undefined' != typeof a.call && 'undefined' != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('call')) return 'function';
  } else return 'null';
  else if ('function' == b && 'undefined' == typeof a.call) return 'object';
  return b;
}
function u(a, b) {
  function c() {}
  c.prototype = b.prototype;
  a.xb = b.prototype;
  a.prototype = new c();
};
var x;
x || (x = {});
(function() {
  function a(a) {
    return (10 > a ? '0' + a : a);
  }
  function b(a) {
    e.lastIndex = 0;
    return (e.test(a) ? '"' + a.replace(e, function(a) {
      var b = j[a];
      return ('string' === typeof b ? b : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
    }) + '"' : '"' + a + '"');
  }
  function c(a, d) {
    var e, i, j, s, r = f,
        q, v = d[a];
    v && ('object' === typeof v && 'function' === typeof v.T) && (v = v.T(a));
    'function' === typeof k && (v = k.call(d, a, v));
    switch (typeof v) {
    case 'string':
      return b(v);
    case 'number':
      return (isFinite(v) ? String(v) : 'null');
    case 'boolean':
    case 'null':
      return String(v);
    case 'object':
      if (!v) return 'null';
      f += g;
      q = [];
      if ('[object Array]' === Object.prototype.toString.apply(v)) {
        s = v.length;
        for (e = 0; e < s; e += 1) q[e] = c(e, v) || 'null';
        j = (0 === q.length ? '[]' : (f ? '[\n' + f + q.join(',\n' + f) + '\n' + r + ']' : '[' + q.join(',') + ']'));
        f = r;
        return j;
      }
      if (k && 'object' === typeof k) {
        s = k.length;
        for (e = 0; e < s; e += 1)'string' === typeof k[e] && (i = k[e], (j = c(i, v)) && q.push(b(i) + ((f ? ': ' : ':')) + j));
      } else for (i in v) Object.prototype.hasOwnProperty.call(v, i) && (j = c(i, v)) && q.push(b(i) + ((f ? ': ' : ':')) + j);
      j = (0 === q.length ? '{}' : (f ? '{\n' + f + q.join(',\n' + f) + '\n' + r + '}' : '{' + q.join(',') + '}'));
      f = r;
      return j;
    }
  }
  'function' !== typeof Date.prototype.T && (Date.prototype.T = function() {
    return (isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + a(this.getUTCMonth() + 1) + '-' + a(this.getUTCDate()) + 'T' + a(this.getUTCHours()) + ':' + a(this.getUTCMinutes()) + ':' + a(this.getUTCSeconds()) + 'Z' : o);
  }, String.prototype.T = Number.prototype.T = Boolean.prototype.T = function() {
    return this.valueOf();
  });
  var d = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      e = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      f, g, j = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
      },
      k;
  'function' !== typeof x.Ua && (x.Ua = function(a, b, d) {
    var e;
    g = f = '';
    if (typeof d === 'number') for (e = 0; e < d; e = e + 1) g = g + ' ';
    else typeof d === 'string' && (g = d);
    (k = b) && (typeof b !== 'function' && (typeof b !== 'object' || typeof b.length !== 'number')) && h(Error('JSON.stringify'));
    return c('', {
      '': a
    });
  });
  'function' !== typeof x.parse && (x.parse = function(a, b) {
    function c(a, d) {
      var e, f, g = a[d];
      if (g && typeof g === 'object') for (e in g) if (Object.prototype.hasOwnProperty.call(g, e)) {
        f = c(g, e);
        (f !== l ? g[e] = f : delete g[e]);
      }
      return b.call(a, d, g);
    }
    var e, a = String(a);
    d.lastIndex = 0;
    d.test(a) && (a = a.replace(d, function(a) {
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }));
    if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      e = eval('(' + a + ')');
      return (typeof b === 'function' ? c({
        '': e
      }, '') : e);
    }
    h(new SyntaxError('JSON.parse'));
  });
}());
this.JSON = x;
x.stringify = x.Ua;
Array.prototype.map || (Array.prototype.map = function(a, b) {
  var c, d, e;
  this == o && h(new TypeError(' this is null or not defined'));
  var f = Object(this),
      g = f.length >>> 0;
  '[object Function]' != {}.toString.call(a) && h(new TypeError(a + ' is not a function'));
  b && (c = b);
  d = Array(g);
  for (e = 0; e < g;) {
    var j;
    e in f && (j = f[e], j = a.call(c, j, e, f), d[e] = j);
    e++;
  }
  return d;
});
Array.prototype.reduce || (Array.prototype.reduce = function(a) {
  (this === o || this === l) && h(new TypeError('Object is null or undefined'));
  var b = 0,
      c = this.length >> 0,
      d;
  typeof a !== 'function' && h(new TypeError('First argument is not callable'));
  if (arguments.length < 2) {
    c === 0 && h(new TypeError('Array length is 0 and no second argument'));
    d = this[0];
    b = 1;
  } else d = arguments[1];
  for (; b < c;) {
    b in this && (d = a.call(l, d, this[b], b, this));
    ++b;
  }
  return d;
});
Array.prototype.forEach || (Array.prototype.forEach = function(a, b) {
  var c, d;
  this == o && h(new TypeError('this is null or not defined'));
  var e = Object(this),
      f = e.length >>> 0;
  ({}.toString.call(a) != '[object Function]' && h(new TypeError(a + ' is not a function')));
  b && (c = b);
  for (d = 0; d < f;) {
    var g;
    if (d in e) {
      g = e[d];
      a.call(c, g, d, e);
    }
    d++;
  }
});
Object.prototype.ua || (Object.prototype.ua = function(a, b) {
  for (var c in this) this.hasOwnProperty(c) && a.call(b, this[c], c);
});
Function.prototype.ab || (Function.prototype.ab = function(a) {
  function b() {
    return e.apply((this instanceof c ? this : a), d.concat(Array.prototype.slice.call(arguments)));
  }
  function c() {}
  typeof this !== 'function' && h(new TypeError('Function.prototype.bind - what is trying to be bound is not callable'));
  var d = Array.prototype.slice.call(arguments, 1),
      e = this;
  c.prototype = this.prototype;
  b.prototype = new c();
  return b;
});
Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
  this == o && h(new TypeError());
  var b = Object(this),
      c = b.length >>> 0;
  if (c === 0) return -1;
  var d = 0;
  if (arguments.length > 0) {
    d = Number(arguments[1]);
    (d != d ? d = 0 : d != 0 && (d != Infinity && d != -Infinity) && (d = (d > 0 || -1) * Math.floor(Math.abs(d))));
  }
  if (d >= c) return -1;
  for (d = (d >= 0 ? d : Math.max(c - Math.abs(d), 0)); d < c; d++) if (d in b && b[d] === a) return d;
  return -1;
});
Array.prototype.map || (Array.prototype.map = function(a, b) {
  var c = this.length;
  typeof a != 'function' && h(new TypeError());
  for (var d = Array(c), e = 0; e < c; e++) e in this && (d[e] = a.call(b, this[e], e, this));
  return d;
});
Array.prototype.reduce || (Array.prototype.reduce = function(a) {
  (this === o || this === l) && h(new TypeError('Object is null or undefined'));
  var b = 0,
      c = this.length >> 0,
      d;
  typeof a !== 'function' && h(new TypeError('First argument is not callable'));
  if (arguments.length < 2) {
    c === 0 && h(new TypeError('Array length is 0 and no second argument'));
    d = this[0];
    b = 1;
  } else d = arguments[1];
  for (; b < c;) {
    b in this && (d = a.call(l, d, this[b], b, this));
    ++b;
  }
  return d;
});
Array.prototype.eb || (Array.prototype.eb = function() {
  return (this.length == 0 ? o : this[0]);
});
Array.prototype.Ma || (Array.prototype.Ma = function() {
  return (this.length == 0 ? o : this[this.length - 1]);
});
Array.prototype.m || (Array.prototype.m = function() {
  return (this.length == 0 ? '' : (this.length == 1 ? this[0] : this.slice(0, this.length - 1).join(', ') + ' and ' + this[this.length - 1]));
});
Array.prototype.Ha || (Array.prototype.Ha = function(a) {
  for (var b = 0, c = this.length; b < c; b++) if (a(this[b], b)) return this[b];
  return o;
});
Array.prototype.wa || (Array.prototype.wa = function(a) {
  for (var b = this.length; b--;) a(this[b], b) && this.splice(b, 1);
});
String.prototype.rb || (String.prototype.rb = function() {
  return this.replace(/^\s+|\s+$/g, '');
});
String.prototype.Ba || (String.prototype.Ba = function(a) {
  return this.indexOf(a) === 0;
});
String.prototype.Ia || (String.prototype.Ia = function() {
  return this.substring(0, 1);
});
String.prototype.ea || (String.prototype.ea = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
});
var ba = Array;

function ea(a, b) {
  if (a.length < 2) return a;
  for (var c = Math.ceil(a.length / 2), d = ea(a.slice(0, c), b), c = ea(a.slice(c), b), e = new ba(); d.length > 0 && c.length > 0;)(b(d[0], c[0]) <= 0 ? e.push(d.shift()) : e.push(c.shift()));
  for (; d.length > 0;) e.push(d.shift());
  for (; c.length > 0;) e.push(c.shift());
  return e;
}
ba.prototype.xa || (ba.prototype.xa = function(a) {
  ea(this, a);
});

function fa(a) {
  a = String(a);
  if ((/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, '')))) try {
    return eval('(' + a + ')');
  } catch (b) {}
  h(Error('Invalid JSON string: ' + a));
}
function ha(a) {
  var b = [];
  ja(new ka(), a, b);
  return b.join('');
}
function ka() {
  this.ia = l;
}
function ja(a, b, c) {
  switch (typeof b) {
  case 'string':
    ma(b, c);
    break;
  case 'number':
    c.push((isFinite(b) && !isNaN(b) ? b : 'null'));
    break;
  case 'boolean':
    c.push(b);
    break;
  case 'undefined':
    c.push('null');
    break;
  case 'object':
    if (b == o) {
      c.push('null');
      break;
    }
    if ('array' == aa(b)) {
      var d = b.length;
      c.push('[');
      for (var e = '', f = 0; f < d; f++) c.push(e), e = b[f], ja(a, (a.ia ? a.ia.call(b, String(f), e) : e), c), e = ',';
      c.push(']');
      break;
    }
    c.push('{');
    d = '';
    for (f in b) Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], 'function' != typeof e && (c.push(d), ma(f, c), c.push(':'), ja(a, (a.ia ? a.ia.call(b, f, e) : e), c), d = ','));
    c.push('}');
    break;
  case 'function':
    break;
  default:
    h(Error('Unknown type: ' + typeof b));
  }
}
var na = {
  '"': '\\"',
  '\\': '\\\\',
  '/': '\\/',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\v': '\\u000b'
},
    oa = (/\uffff/.test('\uffff') ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g);

function ma(a, b) {
  b.push('"', a.replace(oa, function(a) {
    if (a in na) return na[a];
    var b = a.charCodeAt(0),
        e = '\\u';
    (16 > b ? e += '000' : (256 > b ? e += '00' : 4096 > b && (e += '0')));
    return na[a] = e + b.toString(16);
  }), '"');
};

function y(a) {
  a.ua(function(a, c) {
    this[c] = a;
  }, this);
};

function z(a) {
  this.a = a;
};

function pa(a) {
  this.value = a;
}
pa.prototype.toString = function() {
  return qa(A(this.value));
};

function D(a, b, c) {
  this.value = a;
  this.n = b || 'px';
  this.orientation = c || ta;
}
var ta = 'Css.Size.Orientation.ANY';
D.prototype.toString = function() {
  if (F(this.value, 0)) return '0';
  switch (this.n) {
  case 'px':
    return ua(this.value);
  case 'em':
  case 'mm':
  case 'cm':
  case 'in':
  case 'pc':
  case 'pt':
    return qa(A(this.value)) + this.n;
  case 'pt':
  case '%':
    return Math.round(this.value) + this.n;
  default:
    h(Error('unknown unit: ' + this.n));
  }
};
D.prototype.o = function(a) {
  return ('number' == typeof a ? F(this.value, a) : F(this.value, a.value) && this.n == a.n);
};

function va(a) {
  if ('array' == aa(a)) this.r = a;
  else {
    this.r = [];
    for (var b = 0, c = arguments.length; b < c; b++) this.r.push(arguments[b]);
  }
}
va.prototype.toString = function() {
  var a, b = 1;
  do {
    var c = m;
    this.r.forEach(function(a, d) {
      a.o(this.r[d % b]) || (c = p);
    }, this);
    if (c) break;
    b++;
  } while (b < this.r.length);
  a = b;
  for (var d = [], e = 0; e < a; e++) d.push(this.r[e].toString());
  return d.join(' ');
};
va.prototype.o = function(a) {
  if (this.r.length != a.r.length) return p;
  for (var b = m, c = 0, d = this.r.length; c < d; c++) this.r[c].o(a.r[c]) || (b = p);
  return b;
};

function wa(a, b, c) {
  ('number' == typeof b ? (this.n = c || 'px', this.d = a, this.e = b) : (this.n = ('string' == typeof b ? b : 'px'), this.e = this.d = a));
}
function xa(a, b) {
  a.d += b;
  a.e += b;
}
wa.prototype.o = function(a) {
  return ('number' == typeof a ? F(this.d, a) && F(this.e, a) : (this.o(0) && a.o(0) ? m : F(this.d, a.d) && F(this.e, a.e) && this.n == a.n));
};

function ya(a, b, c, d) {
  this.Va = a;
  this.Wa = b;
  this.Da = c;
  this.Ca = d;
  this.S = [this.Va, this.Wa, this.Da, this.Ca];
}
ya.prototype.toString = function() {
  var a = this.S.map(function(a) {
    return new D(a.d, a.n);
  }),
      b = this.S.map(function(a) {
      return new D(a.e, a.n);
    }),
      a = new va(a),
      b = new va(b),
      c = a.toString();
  return (c == b.toString() ? c : a.toString() + ' / ' + b.toString());
};
ya.prototype.J = function() {
  return this.S.reduce(function(a, b) {
    return a && b.o(0);
  }, m);
};

function G(a, b, c, d) {
  this.y = parseFloat(a);
  this.u = parseFloat(b);
  this.s = parseFloat(c);
  this.c = ('undefined' == typeof d ? 1 : parseFloat(d));
}
function Ba(a) {
  return new G(a.y, a.u, a.s, a.c);
}
function Ca(a, b) {
  var c = Da(a, b, b.c);
  c.c = a.c + (1 - a.c) * b.c;
  return c;
}
function Da(a, b, c) {
  return new G(Math.max(Math.min(a.y * (1 - c) + b.y * c, 255), 0), Math.max(Math.min(a.u * (1 - c) + b.u * c, 255), 0), Math.max(Math.min(a.s * (1 - c) + b.s * c, 255), 0), Math.max(Math.min(a.c * (1 - c) + b.c * c, 1), 0));
}
G.prototype.toString = function() {
  if (0.995 < this.c) {
    var a = '#' + (16777216 + (this.y << 16) + (this.u << 8) + this.s).toString(16).slice(1);
    return (a[1] == a[2] && a[3] == a[4] && a[5] == a[6] ? '#' + a[1] + a[3] + a[5] : a);
  }
  return 'rgba(' + qa(Math.round(this.y)) + ',' + qa(Math.round(this.u)) + ',' + qa(Math.round(this.s)) + ',' + qa(A(this.c)) + ')';
};

function Ea(a) {
  this.location = a;
};

function H(a, b) {
  this.location = a;
  this.color = b;
}
u(H, Ea);
H.prototype.toString = function() {
  return '{location: ' + this.location + ', color:' + this.color.toString() + '}';
};

function Fa(a, b) {
  this.location = a;
  this.opacity = b;
}
u(Fa, Ea);
Fa.prototype.toString = function() {
  return '{location: ' + this.location + ', opacity:' + this.opacity + '}';
};

function Ga(a) {
  this.R = a;
}
function Ha(a) {
  switch (Math.round((a.R + 360) % 360)) {
  case 0:
    return 'left';
  case 45:
    return 'bottom left';
  case 90:
    return 'bottom';
  case 135:
    return 'bottom right';
  case 180:
    return 'right';
  case 225:
    return 'top right';
  case 270:
    return 'top';
  case 315:
    return 'top left';
  }
  return o;
};

function Ia() {
  this.D = [];
  this.G = [];
}
Ia.prototype.Aa = function(a, b) {
  return a.location - b.location;
};
Ia.prototype.sort = function() {
  this.D.xa(this.Aa);
  this.G.xa(this.Aa);
};

function Ja(a, b, c) {
  if (0 === b.length) return ('color' == c ? new G(0, 0, 0, 0) : 0);
  if (1 == b.length || a <= b[0].location) return ('color' == c ? Ba(b[0].color) : b[0].opacity);
  if (a >= b[b.length - 1].location) return ('color' == c ? Ba(b[b.length - 1].color) : b[b.length - 1].opacity);
  for (var d = 0, e = b.length - 1; d < e; d++) if (a >= b[d].location && a < b[d + 1].location) return a = (a - b[d].location) / (b[d + 1].location - b[d].location), ('color' == c ? Da(b[d].color, b[d + 1].color, a) : b[d].opacity * (1 - a) + b[d + 1].opacity * a);
  I.$a(p, 'valueAtLocation passed through');
  return ('color' == c ? new G(0, 0, 0, 0) : 0);
}
function Ma(a) {
  function b(a, b) {
    var c = a[b],
        g = (0 < b ? a[b - 1] : o),
        j = (b < a.length - 1 ? a[b + 1] : o),
        k = 0;
    g && (k += (c.location - g.location) / 2);
    j && (k += (j.location - c.location) / 2);
    return k / 100;
  }
  var c = a.D.reduce(function(a, c, f, g) {
    f = b(g, f);
    c = c.color;
    a.y += c.y * f;
    a.u += c.u * f;
    a.s += c.s * f;
    return a;
  }, new G(0, 0, 0, 0)),
      a = a.G.reduce(function(a, c, f, g) {
      return a += c.opacity * b(g, f);
    }, 0);
  c.c = a;
  return c;
}
var Na = [new H(0, new G(0, 0, 0)), new H(100, new G(255, 255, 255))],
    Oa = [new Fa(0, 1), new Fa(100, 1)];

function Pa(a, b, c) {
  if (0 == a.length) return o;
  for (var c = Math.max(-1, c), d = a.length - 1; c < d; c++) if (0 > c) {
    if (b <= a[0].location) return {
      h: a[0],
      index: 0
    };
  } else if (a[c].location <= b && b <= a[c + 1].location) return {
    h: a[c + 1],
    index: c + 1
  };
  return o;
}
function Qa(a, b, c, d, e) {
  I.f('nextStop');
  var f = Pa(a, c, d),
      c = Pa(b, c, e);
  if (f === o && c === o) return o;
  if (f === o || c.h.location < f.h.location) return a = Ja(c.h.location, a, 'color'), a.c *= c.h.opacity, {
    ra: d,
    sa: c.index,
    h: new H(c.h.location, a)
  };
  if (c === o || f.h.location < c.h.location) return a = Ba(f.h.color), b = Ja(f.h.location, b, 'opacity'), a.c *= b, {
    ra: f.index,
    sa: e,
    h: new H(f.h.location, a)
  };
  if (f.h.location == c.h.location) return a = Ba(f.h.color), a.c *= c.h.opacity, {
    ra: f.index,
    sa: c.index,
    h: new H(f.h.location, a)
  };
  I.db('nextStop: no path was successful');
  return o;
}
function Ra(a) {
  var a = (a + 360) % 360,
      b = Math.cos((45 - a % 90) * Math.PI / 180) * Math.sqrt(2),
      a = (a + 90) * Math.PI / 180;
  return {
    d: b * Math.sin(a),
    e: b * Math.cos(a)
  };
};

function J(a, b, c, d) {
  this.O = a;
  this.Q = b;
  this.b = c;
  this.value = d;
}
J.prototype.J = p;
var Wa = new J('Empty', 'css', '.empty', o);
Wa.J = m;
var Xa = new J('Empty', 'less', '.empty', o);
Xa.J = m;
var Ya = new J('Empty', 'sass', '.empty', o);
Ya.J = m;

function Za(a, b, c, d, e) {
  this.O = b;
  this.Q = a;
  this.b = c;
  this.value = d;
  this.x = e;
  this.da = p;
};

function $a() {
  this.ha = {};
}
function M(a, b) {
  if ('undefined' != typeof b) {
    var c = b.l();
    c && (c instanceof Array || (c = [c]), c.forEach(function(a) {
      'array' == aa(this.ha[a.b]) || (this.ha[a.b] = []);
      this.ha[a.b].push(a);
    }, a));
  }
}
var ab = 'Size width height opacity border .rounded .border-radius -moz-border-radius -webkit-border-radius border-radius -moz-background-clip -webkit-background-clip background-clip color font-family font-size font-weight font-style TextDecoration background-color .drop-shadow .box-shadow .shadow -moz-box-shadow -webkit-box-shadow box-shadow text-shadow background-image background BackgroundImage'.split(' '),
    bb = {
    Xa: p,
    pa: p,
    C: p
    };

function cb(a) {
  return '<selector>' + a + '</selector>';
}
function db(a) {
  return '<property>' + a + '</property>';
}
function eb(a) {
  return '<propertyEnd>' + a + '</propertyEnd>';
}
function hb(a) {
  return '<value>' + a + '</value>';
}
function ib() {
  return '<valueSeparator>,</valueSeparator>';
}
function jb() {
  return '<mixinParenEnd>)</mixinParenEnd>';
}
function kb() {
  return '<valueEnd>;</valueEnd>';
}
function lb(a) {
  return '<brace>' + a + '</brace>';
}
function mb(a) {
  return '<comment>' + a + '</comment>';
}
function nb(a, b, c, d, e, f) {
  function g(a, b) {
    for (var c = 0, d = j.length; c < d; c++) if ('any' == b) {
      if (j[c].b == a) return j[c];
    } else if (j[c].b == a && j[c].Q == b) return j[c];
  }
  var j = [];
  a.ha.ua(function(a) {
    var b = d,
        c = a.Ha(function(a) {
        return 'undefined' == typeof a.pa || a.pa == p;
      });
    if (a.length && c) {
      var i = o;
      ('less' == b && 'undefined' != typeof c.q ? i = N(bb, c.aa) : (('sass' == b || 'scss' == b) && 'undefined' != typeof c.t ? i = N(bb, c.oa) : (('stylus_plain' == b || 'stylus_css' == b) && 'undefined' != typeof c.M ? i = N(bb, c.ob) : (i = N(bb, c.cb), b = 'css'))));
      i.Xa && 1 < a.length && (b = 'css');
      var k = c.L || 'non_stackable',
          n = p;
      a.forEach(function(a) {
        function c(a, b, d, f, i) {
          if (d.J) I.log('empty property');
          else if (d.O) {
            b = {
              value: d.value,
              a: (e ? f : ''),
              x: i,
              jb: b,
              L: a
            };
            f = o;
            switch (a) {
            case 'merge_same_prefixes':
              f = g(d.b, d.Q);
              break;
            case 'stackable':
              f = g(d.b, 'any');
              break;
            case 'non_stackable':
              break;
            default:
              I.log('Invalid value of stackable: ' + a);
            }
            if (f) {
              f.x = N(f.x, i);
              f.value.push(b);
            } else {
              f = new Za(d.Q, d.O, d.b, [b], i);
              j.push(f);
            }
          } else I.log('groupKey not present for property ' + b + ' - ' + a + ':' + I.Sa(d));
        }
        var i = a.a,
            s = a.Ea,
            q = o,
            K = o,
            r = o;
        if (b == 'less' && typeof a.q != 'undefined') {
          q = a.q;
          K = 'less';
          r = N(bb, a.aa);
        } else if ((b == 'sass' || b == 'scss') && typeof a.t != 'undefined') {
          q = a.t;
          K = d;
          r = N(bb, a.oa);
        } else if ((b == 'stylus_plain' || b == 'stylus_css') && typeof a.M != 'undefined') {
          q = a.M;
          K = d;
          r = N(bb, a.ob);
        } else {
          q = a.j;
          K = 'css';
          r = N(bb, a.cb);
        }
        if (f && K == 'css') {
          a.Qa && c(k, 'css', a.Qa, i, r);
          a.P && c(k, 'css', a.P, i, r);
          a.va && c(k, 'css', a.va, i, r);
          a.U && c(k, 'css', a.U, i, r);
        }
        q && q.J == p && c(k, K, q, s || i, r);
        K != 'css' && k == 'merge_same_prefixes' && (n = m);
      }, this);
      n && j.wa(function(a) {
        if (a.O == c.b) {
          a.value.wa(function(a) {
            if (a.jb == 'css') return m;
          });
          return a.value.length == 0;
        }
        return p;
      });
    }
  }, a);
  for (var k = [], n = 0, t = ab.length; n < t; n++) for (var E = ab[n], i = 0, w = j.length; i < w; i++) {
    var s = j[i];
    if (!s.da && (s.b == E || s.O == E)) s.da = m, k.push(s);
  }
  i = 0;
  for (w = j.length; i < w; i++) s = j[i], s.da || I.log('Developer: please add property \'' + s.b + '\' (or \'' + s.O + '\') into Css.Rule._propertyOrder'), s.da = p;
  n = '';
  b && (n = '\t');
  var r = n,
      q = [];
  if ('css' == d) b && q.push('' + cb(c) + ' ' + lb('{') + '\n'), k.forEach(function(a) {
    q.push('' + r + db(a.b) + eb(':') + ' ');
    var b = [];
    a.value.forEach(function(c, d) {
      var e = d == a.value.length - 1;
      c.a && b.push(c.a);
      q.push(hb(c.value) + ((e ? kb() + ((b.length ? ' ' + mb('/* ' + b.m() + ' */') : '')) + '\n' : ib() + ' ')));
    }, this);
  }, a), b && q.push(lb('}') + '\n');
  else if ('less' == d) I.k('NOTE: CSS Hat generates code for ' + ob(pb, 'LESS Hat') + ' mixin library \u2014 include it in your project.'), b && q.push('' + cb(c) + ' ' + lb('{') + '\n'), k.forEach(function(a) {
    var b = p,
        c = (a.x.C ? '<mixinTilda>~</mixinTilda><mixinQuote>"</mixinQuote>' : ''),
        d = (a.x.C ? '<mixinQuoteEnd>"</mixinQuoteEnd>' : ''),
        e = 'less' == a.Q,
        f = ((e ? jb() : '')) + kb(),
        g = (1 < a.value.length && !a.x.C ? '\n' + r : '');
    q.push('' + r + db(a.b) + ((e ? '<mixinParen>(</mixinParen>' : eb(':') + ' ')) + g);
    var i = [];
    a.value.forEach(function(e, j) {
      var k = 0 == j,
          n = j == a.value.length - 1;
      e.a && i.push(e.a);
      q.push(((k ? c : '')) + hb(e.value) + ((n ? d + f : ', ')) + ((n && a.x.C && i.length ? ' ' + mb('// ' + i.m()) : '')) + ((e.a && !a.x.C ? (n ? ' ' + mb('// ' + e.a) : ' ' + mb('/* ' + e.a + ' */')) : '')) + ((n ? '\n' : g)));
      'background-image' == e.value && (b = m);
    }, this);
    b && I.k('NOTE: LESS Elements doesn\'t have a mixin for background image, you might want to turn vendor prefixes on.');
  }, a), b && q.push(lb('}') + '\n');
  else if ('sass' == d || 'scss' == d) {
    I.k('NOTE: CSS Hat generates code for ' + ob(qb, 'Compass') + ' ' + ob(rb, 'CSS3') + ' framework.');
    var v = [],
        n = ('scss' == d ? ' ' + lb('{') : ''),
        t = ('scss' == d ? lb('}') + '\n' : ''),
        C = ('scss' == d ? eb(';') : '');
    b && q.push('' + cb(c) + n + '\n');
    k.forEach(function(a) {
      if (0 == a.value.length) I.log('note: triple ' + a.b + ' with no values');
      else {
        var b = 'sass' == a.Q,
            c = (1 < a.value.length ? ('scss' == d ? '\n' + r + '\t' : ' ') : ' '),
            e = p;
        (b ? (e = a.b, q.push('' + r + '<include>@include</include> ' + db(a.b) + '<mixinParen>(</mixinParen>')) : q.push('' + r + db(a.b) + eb(':') + c));
        var f = [];
        a.value.forEach(function(d, g) {
          var i = g == a.value.length - 1;
          d.a && f.push(d.a);
          if (b) {
            if (d.x.qa) e = d.x.qa;
            q.push(hb(d.value) + ((i ? jb() + C + ((f.length ? ' ' + mb('// ' + f.m()) : '')) + '\n' : ib() + ' ')));
          } else q.push(hb(d.value) + ((i ? C + ((f.length ? ' ' + mb('// ' + f.m()) : '')) + '\n' : ib() + c)));
        }, this);
        e && v.push(e);
      }
    }, a);
    b && q.push(t);
  } else if ('stylus_plain' == d || 'stylus_css' == d) {
    I.k('NOTE: CSS Hat generates code for ' + ob(sb, 'Stylus nib') + ' framework.');
    var n = ('stylus_css' == d ? ' ' + lb('{') : ''),
        t = ('stylus_css' == d ? lb('}') + '\n' : ''),
        da = ('stylus_css' == d ? eb(':') : ''),
        C = ('stylus_css' == d ? kb() : '');
    b && q.push('' + cb(c) + n + '\n');
    k.forEach(function(a) {
      if (0 == a.value.length) I.log('note: triple ' + a.b + ' with no values');
      else {
        q.push('' + r + db(a.b) + da + ' ');
        var b = [];
        a.value.forEach(function(c, d) {
          var e = d == a.value.length - 1;
          c.a && b.push(c.a);
          q.push(hb(c.value) + ((e ? C + ((b.length ? ' ' + mb('// ' + b.m()) : '')) + '\n' : ib() + ' ')));
        }, this);
      }
    }, a);
    b && q.push(t);
  }
  return q.join('');
};

function tb(a, b, c) {
  this.a = c;
  this.width = a;
  this.height = b;
  this.a = c;
}
u(tb, z);
tb.prototype.l = function() {
  return [new y({
    b: 'Size',
    a: this.a,
    j: Wa,
    q: new J('Size', 'less', '.size', (this.width.o(this.height) ? this.width.toString() : this.width.toString() + ', ' + this.height.toString()))
  }), new y({
    b: 'Width',
    a: this.a,
    j: new J('Width', 'css', 'width', this.width.toString()),
    q: Xa
  }), new y({
    b: 'Height',
    a: this.a,
    j: new J('Height', 'css', 'height', this.height.toString()),
    q: Xa
  })];
};

function ub(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(ub, z);
ub.prototype.l = function() {
  return new y({
    b: 'Opacity',
    a: this.a,
    j: new J('Opacity', 'css', 'opacity', this.value.toString()),
    Oa: new J('Opacity', 'less', '.opacity', this.value.toString()),
    t: new J('Opacity', 'sass', 'opacity', this.value.toString()),
    M: new J('Opacity', 'stylus', 'opacity', this.value.toString())
  });
};

function vb(a, b, c, d) {
  this.a = d;
  this.width = a;
  this.type = b;
  this.color = c;
  this.a = d;
}
u(vb, z);
vb.prototype.l = function() {
  return new y({
    b: 'Border',
    L: 'non_stackable',
    a: this.a,
    j: new J('Border', 'css', 'border', this.width.toString() + ' ' + this.type + ' ' + this.color.toString())
  });
};

function Eb(a, b) {
  this.a = b;
  this.Ta = a;
  this.a = b;
}
u(Eb, z);
Eb.prototype.l = function() {
  var a = '',
      b, c, a = this.Ta.toString();
  b = this.Ta;
  if (0 == b.S.length) b = m;
  else {
    var d = b.S[0];
    b = b.S.reduce(function(a, b) {
      return a && b.o(d);
    }, m);
  }(b ? (b = new J('BorderRadius', 'less', '.rounded', a), c = new J('BorderRadius', 'less', '.border-radius', a)) : (b = new J('BorderRadius', 'less', '.border-radius', a), c = new J('BorderRadius', 'less', '.border-radius', '<mixinTilda>~</mixinTilda><mixinQuote>"</mixinQuote>' + a + '<mixinQuoteEnd>"</mixinQuoteEnd>')));
  var e = /\//.test(a);
  return [new y({
    b: 'BorderRadius',
    Ea: this.a,
    P: new J('BorderRadius', 'moz', '-moz-border-radius', a),
    U: new J('BorderRadius', 'webkit', '-webkit-border-radius', a),
    j: new J('BorderRadius', 'css', 'border-radius', a),
    Oa: b,
    aa: {
      C: e
    },
    q: c,
    t: new J('BorderRadius', 'sass', 'border-radius', a),
    M: new J('BorderRadius', 'stylus', 'border-radius', a)
  }), new y({
    b: 'BackgroundClip',
    Ea: 'prevents bg color from leaking outside the border',
    P: new J('BackgroundClip', 'moz', '-moz-background-clip', 'padding'),
    U: new J('BackgroundClip', 'webkit', '-webkit-background-clip', 'padding-box'),
    j: new J('BackgroundClip', 'css', 'background-clip', 'padding-box'),
    t: new J('BackgroundClip', 'sass', 'background-clip', 'padding-box'),
    M: new J('BackgroundClip', 'stylus', 'background-clip', 'padding-box'),
    q: Xa
  })];
};

function Fb(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Fb, z);
Fb.prototype.l = function() {
  return new y({
    b: 'Color',
    a: this.a,
    j: new J('Color', 'css', 'color', this.value.toString())
  });
};

function Gb(a, b) {
  this.a = b;
  this.fb = a;
  this.a = b;
}
u(Gb, z);
Gb.prototype.l = function() {
  return new y({
    b: 'FontFamily',
    a: this.a,
    j: new J('FontFamily', 'css', 'font-family', this.fb)
  });
};

function Hb(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Hb, z);
Hb.prototype.l = function() {
  return new y({
    b: 'FontSize',
    a: this.a,
    j: new J('FontSize', 'css', 'font-size', this.value.toString())
  });
};

function Ib(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Ib, z);
Ib.prototype.l = function() {
  return new y({
    b: 'FontWeight',
    a: this.a,
    j: new J('FontWeight', 'css', 'font-weight', this.value.toString())
  });
};

function Jb(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Jb, z);
Jb.prototype.l = function() {
  return new y({
    b: 'FontStyle',
    a: this.a,
    j: new J('FontStyle', 'css', 'font-style', this.value.toString())
  });
};

function Kb(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Kb, z);
Kb.prototype.l = function() {
  if ('no_decoration' != this.value) return new y({
    b: 'TextDecoration',
    a: this.a,
    j: new J('TextDecoration', 'css', 'text-decoration', this.value.toString())
  });
};

function Lb(a, b) {
  this.a = b;
  this.value = a;
  this.a = b;
}
u(Lb, z);
Lb.prototype.l = function() {
  return new y({
    b: 'BackgroundColor',
    a: this.a,
    j: new J('BackgroundColor', 'css', 'background-color', this.value.toString())
  });
};

function Mb(a, b, c, d, e, f, g) {
  this.a = g;
  this.F = a;
  this.d = b;
  this.e = c;
  this.blur = d;
  this.g = e;
  this.color = f;
  this.a = g;
}
u(Mb, z);

function Nb(a, b) {
  var c = (a.F ? 'inset ' : ''),
      c = (a.g.o(0) ? c + a.d.toString() + ' ' + a.e.toString() + ' ' + a.blur.toString() + ' ' + a.color.toString() : c + a.d.toString() + ' ' + a.e.toString() + ' ' + a.blur.toString() + ' ' + a.g.toString() + ' ' + a.color.toString()),
      d = new J(b, 'less', '.box-shadow', c),
      e = new J(b, 'less', '.box-shadow', c);
  a.F == p && (1 > a.color.y && (1 > a.color.u && 1 > a.color.s) && a.g.o(0)) && (e = new J(b, 'less', '.drop-shadow', a.d.toString() + ', ' + a.e.toString() + ', ' + a.blur.toString() + ', ' + a.color.c.toString()));
  return {
    K: c,
    kb: e,
    lb: d
  };
};

function Ob(a, b, c, d, e, f, g) {
  Mb.call(this, a, b, c, d, e, f, g);
}
u(Ob, Mb);
Ob.prototype.l = function() {
  if (0 >= this.color.c - 0.0005) return o;
  var a = Nb(this, 'BoxShadow');
  return new y({
    b: 'BoxShadow',
    L: 'stackable',
    a: this.a,
    P: new J('BoxShadow', 'moz', '-moz-box-shadow', a.K),
    U: new J('BoxShadow', 'webkit', '-webkit-box-shadow', a.K),
    j: new J('BoxShadow', 'css', 'box-shadow', a.K),
    vb: {
      Xa: m
    },
    Oa: a.kb,
    aa: {
      C: m
    },
    q: a.lb,
    t: new J('BoxShadow', 'sass', 'box-shadow', a.K),
    M: new J('BoxShadow', 'stylus', 'box-shadow', a.K)
  });
};

function Pb(a, b, c, d, e) {
  Mb.call(this, p, a, b, c, new D(0), d, e);
}
u(Pb, Mb);
Pb.prototype.l = function() {
  if (0 >= this.color.c - 0.0005) return o;
  var a = Nb(this, 'TextShadow');
  return new y({
    b: 'TextShadow',
    L: 'non_stackable',
    a: this.a,
    j: new J('TextShadow', 'css', 'text-shadow', a.K),
    t: new J('TextShadow', 'sass', 'text-shadow', a.K)
  });
};

function Qb(a, b) {
  this.a = b;
  this.pb = a;
  this.a = b;
}
u(Qb, z);
Qb.prototype.l = function() {
  return new y({
    pa: m,
    b: 'BackgroundImage',
    L: 'merge_same_prefixes',
    a: this.a,
    Qa: new J('BackgroundImage', 'ms', 'background-image', '<base64>' + this.pb + '</base64>'),
    q: Xa,
    t: Ya
  });
};

function Rb(a, b, c) {
  this.a = c;
  this.I = a;
  this.La = b;
  this.a = c;
}
u(Rb, z);
Rb.prototype.l = function() {
  var a = ((0 == Math.round((this.I.R + 360) % 360) % 45 ? Ha(this.I) : A((this.I.R + 360) % 360) + 'deg')) + ', ' + this.La,
      b = ((0 == Math.round((this.I.R + 360) % 360) % 45 ? Ha(this.I) : A((90 - this.I.R + 360) % 360) + 'deg')) + ', ' + this.La,
      b = {
      b: 'BackgroundImage',
      L: 'merge_same_prefixes',
      a: this.a,
      P: new J('BackgroundImage', 'moz', 'background-image', '-moz-linear-gradient(' + a + ')'),
      va: new J('BackgroundImage', 'opera', 'background-image', '-o-linear-gradient(' + a + ')'),
      U: new J('BackgroundImage', 'webkit', 'background-image', '-webkit-linear-gradient(' + a + ')'),
      j: new J('BackgroundImage', 'css', 'background-image', 'linear-gradient(' + b + ')'),
      aa: {
        C: m
      },
      q: new J('BackgroundImage', 'less', '.background-image', 'linear-gradient(' + b + ')'),
      oa: {
        qa: 'images'
      },
      t: new J('BackgroundImage', 'sass', 'background-image', 'linear-gradient(' + a + ')')
      };
  0 == Math.round((this.I.R + 360) % 360) % 45 && (b.M = new J('BackgroundImage', 'stylus', 'background', 'linear-gradient(' + a + ')'));
  return new y(b);
};

function Tb(a, b, c) {
  this.a = c;
  this.Y = a;
  this.mb = b;
  this.a = c;
}
u(Tb, z);
Tb.prototype.l = function() {
  return new y({
    b: 'BackgroundImage',
    L: 'merge_same_prefixes',
    a: this.a,
    P: new J('BackgroundImage', 'moz', 'background-image', '-moz-radial-gradient(' + this.mb + ')'),
    va: new J('BackgroundImage', 'opera', 'background-image', '-o-radial-gradient(' + this.Y + ')'),
    U: new J('BackgroundImage', 'webkit', 'background-image', '-webkit-radial-gradient(' + this.Y + ')'),
    j: new J('BackgroundImage', 'css', 'background-image', 'radial-gradient(' + this.Y + ')'),
    aa: {
      C: m
    },
    q: new J('BackgroundImage', 'less', '.background-image', 'radial-gradient(' + this.Y + ')'),
    oa: {
      qa: 'images'
    },
    t: new J('BackgroundImage', 'sass', 'background-image', 'radial-gradient(' + this.Y + ')')
  });
};
var I = {
  V: p,
  N: {
    za: 'traceOut',
    Ya: 'traceIn',
    V: 'trace',
    ya: 'log'
  },
  ca: [],
  ma: [],
  H: 0,
  bb: function() {
    I.ca = [];
    I.ma = [];
    I.H = 0;
  },
  k: function(a) {
    I.ma.push(a);
    'object' == typeof console && console.log('[NOTE] ' + a);
  },
  f: function(a) {
    I.W(I.N.V, '#' + a);
  },
  ja: function(a) {
    I.W(I.N.Ya, a + '()');
    I.H += 1;
  },
  wb: function() {
    $.hiresTimer;
  },
  ub: function(a) {
    I.W(a + ': ' + $.hiresTimer / 1000000 + ' s');
  },
  ka: function() {
    I.W(I.N.za, '');
    0 < I.H && (I.H -= 1);
  },
  log: function(a) {
    I.W(I.N.ya, a);
    'object' == typeof console && console.log(a);
  },
  nb: function(a) {
    'object' == typeof $ && 'function' == typeof $.writeln && $.writeln(unescape(a));
  },
  W: function(a, b) {
    I.ca.unshift({
      hb: I.H,
      type: a,
      message: b
    });
  },
  Za: function(a, b) {
    var c = Array(b + 1).join('\t');
    return c + a.split('\n').join('\n' + c);
  },
  Pa: function(a, b) {
    I.log(((b ? b + ': ' : '')) + I.Sa(a));
  },
  Sa: function(a) {
    return ha(a);
  },
  Ja: function() {
    for (var a = '', b = 0, c = I.ca.length; b < c; b++) {
      var d = I.ca[b];
      if (d.type === I.N.ya || I.V && d.type !== I.N.za) a += I.Za(d.message, (I.V ? d.hb : 0)) + '\n';
    }
    return a;
  },
  Ka: function() {
    return I.ma.join('\n');
  },
  db: function(a) {
    I.log('Assertion failed: ' + a);
  },
  $a: function(a, b) {
    a || I.log('Assertion failed: ' + b);
  },
  Ga: function(a, b) {
    return ((a.name ? a.name : 'unknown error')) + ' at ' + ((a.line ? a.line : 'unknown line')) + ': ' + ((!b && a.message ? a.message : 'unknown message'));
  }
};
this.Debug = I;
I.psLog = I.nb;
I.log = I.log;
I.logObj = I.Pa;

function Ub(a, b) {
  return function() {
    return a.apply(b, Array.prototype.slice.call(arguments));
  };
}
function Vb(a, b) {
  for (var c = 0, d = arguments.length; c < d; c++) if ('undefined' != typeof arguments[c]) for (var e in arguments[c]) a[e] = arguments[c][e];
  return a;
}
function N(a) {
  var b = Array.prototype.slice.call(arguments);
  b.unshift({});
  return Vb.apply(l, b);
};

function Wb(a, b) {
  typeof a != b && h(Error('Expected ' + b + ', got ' + typeof a));
  return a;
};
var Xb = charIDToTypeID,
    O = stringIDToTypeID,
    Yb = typeIDToStringID,
    Zb = {
    ActionDescriptor: function(a) {
      for (var b = {
        '@type': 'ActionDescriptor'
      }, c = 0; c < a.count; c++) {
        var d = a.getKey(c),
            e = a.getType(d);
        b[Yb(d)] = Zb[e](a, d);
      }
      return b;
    },
    'DescValueType.ALIASTYPE': function() {
      return {
        '@type': 'DescValueType.ALIASTYPE'
      };
    },
    'DescValueType.BOOLEANTYPE': function(a, b) {
      return a.getBoolean(b);
    },
    'DescValueType.CLASSTYPE': function(a, b) {
      return a.getClass(b);
    },
    'DescValueType.DOUBLETYPE': function(a, b) {
      return a.getDouble(b);
    },
    'DescValueType.ENUMERATEDTYPE': function(a, b) {
      a.getEnumerationType(b);
      var c = a.getEnumerationValue(b);
      return typeIDToStringID(c);
    },
    'DescValueType.INTEGERTYPE': function(a, b) {
      return a.getInteger(b);
    },
    'DescValueType.LISTTYPE': function(a, b) {
      return Zb.ActionList(a, b);
    },
    'DescValueType.OBJECTTYPE': function(a, b) {
      a.getObjectType(b);
      var c = a.getObjectValue(b);
      return Zb.ActionDescriptor(c, b);
    },
    'DescValueType.RAWTYPE': function(a, b) {
      try {
        return a.getData(b);
      } catch (c) {}
    },
    'DescValueType.REFERENCETYPE': function(a, b) {
      Zb.ActionReference(a, b);
    },
    'DescValueType.STRINGTYPE': function(a, b) {
      return a.getString(b);
    },
    'DescValueType.UNITDOUBLE': function(a, b) {
      var c = a.getUnitDoubleType(b),
          d = a.getUnitDoubleValue(b);
      return {
        '@type': Yb(c),
        value: d
      };
    },
    ActionList: function(a, b) {
      var c = a.getList(b),
          d = [];
      d['@type'] = 'ActionList';
      for (var e = 0; e < c.count; e++) {
        var f = c.getType(e);
        d.push(Zb[f.toString()](c, e));
      }
      return d;
    },
    ActionReference: function(a, b) {
      for (var c = a.getReference(b), d = 0, e = c;;) {
        try {
          e = e.getContainer();
        } catch (f) {
          break;
        }
        d++;
      }
      d = [];
      d['@type'] = 'ActionReference';
      do {
        var g = e = l;
        try {
          e = c.getForm(), g = c.getDesiredClass();
        } catch (j) {}
        if (!e || !g) break;
        d.push($b[e.toString()](c, g));
        try {
          c = c.getContainer();
        } catch (k) {
          c = o;
        }
      } while (c);
      return d;
    }
    },
    $b = {
    'ReferenceFormType.CLASSTYPE': function(a) {
      return a.getDesiredClass();
    },
    'ReferenceFormType.ENUMERATED': function(a) {
      return {
        '@type': 'ReferenceFormType.ENUMERATED',
        value: a.getEnumeratedValue()
      };
    },
    'ReferenceFormType.IDENTIFIER': function(a) {
      a.getDesiredClass();
      a.getIdentifier();
      return {
        '@type': 'ReferenceFormType.IDENTIFIER'
      };
    },
    'ReferenceFormType.INDEX': function(a) {
      a.getDesiredClass();
      return a.getIndex();
    },
    'ReferenceFormType.NAME': function(a) {
      a.getDesiredClass();
      return a.getName();
    },
    'ReferenceFormType.OFFSET': function(a) {
      a.getDesiredClass();
      return a.getOffset();
    },
    'ReferenceFormType.PROPERTY': function(a) {
      a.getDesiredClass();
      return a.getProperty();
    }
    };

function P(a, b) {
  var c = typeof a,
      d = '<property id = "' + b + '" >';
  switch (c) {
  case 'number':
    d = d + '<number>' + a.toString();
    d += '</number>';
    break;
  case 'boolean':
    d += '<' + a.toString() + '/>';
    break;
  case 'string':
    d = d + '<string>' + a.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    d += '</string>';
    break;
  case 'object':
    I.log('Object case is currently not supported');
    break;
  case 'undefined':
    d += '<string>undefined</string>';
    break;
  default:
    return I.log('Type ' + c + ' is unknown.'), '';
  }
  return d + '</property>';
};
var ac = {},
    fc = Folder.userData,
    gc = p;

function hc(a) {
  return fc + (('mac' == a ? '/' : '\\')) + '.csshat';
}
this.getPreference = function(a) {
  return '<object>' + P(ac[a] || l, 'value') + '</object>';
};
this.setPreference = function(a) {
  (a = a.match(/^([^:]+):(.*)$/)) && (ac[a[1]] = a[2]);
};
this.savePreferences = function(a) {
  a = new File(hc(a));
  if (!a.open('w')) return 'false';
  var b;
  b = ha(ac);
  a.writeln(b);
  a.close();
  return 'true';
};
this.loadPreferences = function(a) {
  if (gc) return 'true';
  a = new File(hc(a));
  if (!a.exists) return 'false';
  if (!a.open('r')) return 'error';
  var b = a.read();
  a.close();
  if (b.Ba('{')) ac = fa(b);
  else for (var a = b.split(/[\r\n\s]+/g), b = 0, c = a.length; b < c; b++) {
    var d = a[b].split(':');
    2 == d.length && (ac[d[0]] = d[1]);
  }
  gc = m;
  return 'true';
};
this.getPreferencesFilename = hc;

function ob(a, b) {
  'undefined' == typeof b && (b = a);
  return '<a href="' + a + '"><u>' + b + '</u></a>';
};

function A(a) {
  return Math.round(100 * a) / 100;
}
function ua(a) {
  return (0.5 < Math.abs(a) ? Math.round(a) + 'px' : 0);
}
function qa(a) {
  return a.toString().replace(/^[0]\./g, '.');
}
function F(a, b) {
  return 0.0005 > Math.abs(a - b);
}
function ic(a, b) {
  return new wa(Math.abs(a.d - b.d), Math.abs(a.e - b.e), 'px');
}
function jc(a) {
  return 0 * (1 - (a - -50) / 100) + 100 * ((a - -50) / 100);
};
var pb = 'http://lesshat.com',
    qb = 'http://compass-style.org',
    rb = 'http://compass-style.org/reference/compass/css3/',
    sb = 'http://visionmedia.github.com/nib/';

function kc(a, b, c) {
  try {
    switch (c) {
    case 'text':
      var d = {
        qb: a.getObjectValue(b).getString(O('text'))
      };
      return d;
    case 'rectangle':
      var e = a.getObjectValue(b);
      return {
        top: e.getUnitDoubleValue(O('top')),
        bottom: e.getUnitDoubleValue(O('bottom')),
        left: e.getUnitDoubleValue(O('left')),
        right: e.getUnitDoubleValue(O('right'))
      };
    case 'offset':
      var f = a.getObjectValue(b);
      return {
        horizontal: f.getUnitDoubleValue(O('horizontal')),
        vertical: f.getUnitDoubleValue(O('vertical'))
      };
    case 'color':
      var g = a.getObjectValue(b),
          j;
      switch (app.activeDocument.mode) {
      case DocumentMode.GRAYSCALE:
        var k = g.getDouble(Q('Gry '));
        j = new G(k, k, k, 1);
        break;
      case DocumentMode.RGB:
        var n = g.getDouble(Q('Rd  ')),
            t = g.getDouble(Q('Grn ')),
            E = g.getDouble(Q('Bl  '));
        j = new G(n, t, E, 1);
        break;
      case DocumentMode.CMYK:
        var i = g.getDouble(Q('Cyn ')),
            w = g.getDouble(Q('Mgnt')),
            s = g.getDouble(Q('Ylw ')),
            r = g.getDouble(Q('Blck')),
            i = Math.min(255, i + r),
            w = Math.min(255, w + r),
            s = Math.min(255, s + r);
        j = new G(255 - i, 255 - w, 255 - s, 1);
        break;
      case DocumentMode.LAB:
        g.getDouble(Q('Lmnc'));
        g.getDouble(Q('A   '));
        g.getDouble(Q('B   '));
        I.log('LAB color is not supported yet.');
        j = new G(1, 0, 1, 1);
        break;
      default:
        I.log('Unknown color mode: ' + app.activeDocument.mode);
      }
      return j;
    case 'textLayer':
      return f = a.getObjectValue(b), d = {
        qb: f.getString(O('text'))
      };
    case 'object':
      return a.getObjectValue(b);
    default:
      switch (a.getType(b)) {
      case DescValueType.LISTTYPE:
        return a.getList(b);
      case DescValueType.UNITDOUBLE:
        return a.getUnitDoubleValue(b);
      case DescValueType.DOUBLETYPE:
        return a.getDouble(b);
      case DescValueType.STRINGTYPE:
        return a.getString(b);
      case DescValueType.BOOLEANTYPE:
        return a.getBoolean(b);
      case DescValueType.ENUMERATEDTYPE:
        return Yb(a.getEnumerationValue(b));
      case DescValueType.INTEGERTYPE:
        return a.getInteger(b);
      case DescValueType.CLASSTYPE:
        return a.getClass(b);
      case DescValueType.RAWTYPE:
        return a.getData(b);
      case DescValueType.REFERENCETYPE:
        return a.getData(b);
      default:
        return a.getObjectValue(b);
      }
    }
  } catch (q) {
    h(Error('Failed reading: ' + Yb(b)));
  }
}
function R(a, b, c, d) {
  var e = [];
  try {
    e.push('_get: ' + b + '(' + c + ')');
    for (var f = b.split('.'), g = 0, j = f.length; g < j; ++g) {
      var k = f[g],
          n = (g == f.length - 1 ? c : 'object'),
          t;
      if (t = k.match(/([^\[]+)\[([0-9+])\]/)) {
        var k = t[1],
            E = parseInt(t[2], 10);
        e.push('- reading ' + k + '[' + E + '](' + n + ')');
        var i;
        try {
          i = a.getList(T(k));
        } catch (w) {
          h(Error('Failed reading: ' + k));
        }
        a = kc(i, E, n);
      } else {
        e.push('- reading ' + k + '(' + n + ')');
        try {
          a = kc(a, T(k), n);
        } catch (s) {
          a = o;
        }
      }
    }
    return a;
  } catch (r) {
    return d || I.log('Error in _getPsObjectPropertyChain:  path: ' + b + ', type: ' + c + ', exception: ' + I.Ga(r, p) + '\n   ' + e.join('\n   ')), p;
  }
}
function lc() {
  var a = new ActionReference();
  a.putEnumerated(Q('Lyr '), Q('Ordn'), Q('Trgt'));
  return app.executeActionGet(a);
}
function W(a, b, c) {
  var d = lc();
  return R(d, a, b, c);
};

function mc(a, b) {
  var c;
  if (0 < b) {
    c = Ba(a.color);
    var d = a.g - b,
        e = Math.max(0, d);
    0 > d && (c.c *= 1 - Math.min(1, -d / a.blur));
    c = nc(a.angle, a.distance, a.blur, e, c, p, p);
  } else c = nc(a.angle, a.distance, a.blur, a.g, a.color, p, p);
  return c;
}
function nc(a, b, c, d, e, f, g) {
  !g && oc && (1 > b && 1 <= c && 1.0005 > d + c) && (e.c *= Math.max(Math.min(d, 1), 0.5), d = 1, c = 0);
  return {
    F: (f ? m : p),
    d: new D(-(Math.round(10 * b * Math.cos(a * Math.PI / 180)) / 10)),
    e: new D(Math.round(10 * b * Math.sin(a * Math.PI / 180)) / 10),
    blur: new D(c),
    g: new D((0.0005 < d ? d : 0)),
    color: e
  };
};

function rc() {
  var a = app.activeDocument.activeLayer;
  'undefined' == typeof a && h(new sc(tc));
  I.ja('LayerStyle');
  this.$ = a;
  this.style = {};
  this.style.dropShadow = [];
  this.style.innerShadow = [];
  this.style.outerGlow = [];
  this.style.innerGlow = [];
  this.style.stroke = [];
  this.style.solidFill = [];
  this.style.gradientFill = [];
  this.style.opacity = [];
  this.style.borderRadius = [];
  this.style.dimensions = [];
  this.style.font = [];
  this.na = [];
  this.Z = [];
  this.ba = [];
  I.f('layerToJson');
  var a = lc(),
      b = l,
      b = a.typename + 'Object';
  this.Ra = Zb[a.typename](a, b);
  I.f('resolution');
  this.resolution = 72;
  I.f('readLayerSection');
  this.layerSection = this.Ra.layerSection;
  ('layerSectionStart' == this.layerSection || 'layerSectionEnd' == this.layerSection) && h(new sc(uc));
  'layerSectionContent' != this.layerSection && h(new sc(vc, 'Unexpected layer type: ' + this.layerSection));
  I.f('readId');
  a = lc();
  this.gb = Wb(a.getInteger(Q('LyrI')), 'number').toString();
  this.name = Wb(W('name'), 'string');
  wc(this, '', 'layer');
  this.la = p;
  this.ta = this.$.kind.toString();
  this.p = 'LayerKind.TEXT' === this.ta;
  this.Na = Wb(W('opacity') / 255, 'number');
  this.ga = Wb(W('fillOpacity') / 255, 'number');
  this.globalAngle = Wb(W('globalAngle'), 'number');
  1 > this.Na && this.style.opacity.push({
    value: this.Na,
    a: 'layer alpha'
  });
  if (this.p && xc) {
    var c, d = this.$.textItem;
    d.contents || h(new sc(yc));
    var e = d.font,
        a = d && d.size || 20,
        f, g, b = UnderlineType.UNDERLINEOFF;
    try {
      b = d && d.underline || UnderlineType.UNDERLINEOFF;
    } catch (j) {}
    var k = 'normal',
        n = 'normal';
    try {
      g = app.fonts[e];
    } catch (t) {}(g ? (d = g.name, f = g.family, g = g.style) : (I.k('Font ' + e + ' is not available on your computer and because of that, we cannot get it\'s family and style :(.'), g = f = d = e));
    e = [];
    g.match(/bold/i) && (k = 'bold', e.push('font weight (' + k + ')'));
    g.match(/italic/i) && (n = 'italic', e.push('font style (' + n + ')'));
    e.length && I.k(e.m().ea() + ' ' + ((1 < e.length ? 'are' : 'is')) + ' guessed from font name.');
    try {
      c = new G(this.$.textItem.color.rgb.red, this.$.textItem.color.rgb.green, this.$.textItem.color.rgb.blue, 1);
    } catch (E) {
      c = new G(0, 0, 0, 1);
    }
    c = {
      color: {
        color: c
      },
      name: d || o,
      fa: f || o,
      tb: k || o,
      style: n || o,
      size: a || o,
      sb: (b ? (b == UnderlineType.UNDERLINEOFF ? p : m) : o)
    };
    this.style.solidFill.push({
      value: c.color,
      a: 'text color'
    });
    this.style.font.push({
      value: c,
      a: 'font'
    });
  } else 'LayerKind.SOLIDFILL' == this.ta && 0.01 < this.ga && this.style.solidFill.push({
    value: zc(this),
    a: 'layer fill content'
  });
  I.f('layerFxEnabled');
  if (W('layerFXVisible', l, m)) {
    I.f('solidFillFx');
    c = o;
    X('solidFill') && (wc(this, 'solidFill', 'solid fill'), g = {
      color: Y('solidFill.color', 'color')
    }, c = Y('solidFill.opacity') / 100, g.color.c = c, c = g.color, this.style.solidFill.push({
      value: g,
      a: 'color overlay'
    }));
    I.f('gradientFillFx');
    X('gradientFill') && (g = c, wc(this, 'gradientFill', 'gradient fill'), a = Y('gradientFill'), g = Ac(this, a, p, g), a = 'gradient overlay', c && (a = this.style.solidFill.Ma().a + ' + ' + a, this.style.solidFill.pop()), this.style.gradientFill.push({
      value: g,
      a: a
    }));
    I.f('frameFX');
    var i;
    X('frameFX') && (wc(this, 'frameFX', 'stroke'), ('solidColor' == Y('frameFX.paintType') ? i = Y('frameFX.color', 'color') : (this.Z.push('stroke'), i = Ma(Ac(this, Y('frameFX')).gradient))), i = {
      size: parseFloat(Y('frameFX.size')),
      color: i,
      style: Y('frameFX.style')
    }, c = Y('frameFX.opacity') / 100, i.color.c = c, this.style.stroke.push({
      value: i,
      a: 'stroke'
    }));
    I.f('dropShadow');
    X('dropShadow') && (wc(this, 'dropShadow', 'drop shadow'), c = Bc(this, 'dropShadow', 'drop shadow', m), this.style.dropShadow.push({
      value: c,
      a: 'drop shadow'
    }));
    I.f('innerShadow');
    X('innerShadow') && this.style.innerShadow.push({
      value: Cc(this),
      a: 'inner shadow'
    });
    I.f('innerGlow');
    X('innerGlow') && ((Y('innerGlow.color', 'color') || Ac(this, Y('innerGlow')) ? this.style.innerGlow.push({
      value: Dc(this),
      a: 'inner glow'
    }) : this.ba.push('inner glow')));
    I.f('outerGlow');
    X('outerGlow') && ((Y('outerGlow.color', 'color') || Ac(this, Y('outerGlow')) ? this.style.outerGlow.push({
      value: Ec(this),
      a: 'outer glow'
    }) : this.ba.push('outer glow')));
    if (!this.p && 'undefined' != typeof i && ('insetFrame' == i.style || 'centeredFrame' == i.style)) {
      var w = i.size;
      i = function(a) {
        var b = w;
        if (a.value.g > 0) {
          var c = a.value.g;
          a.value.g = Math.max(a.value.g - b, 0);
          b = b - (c - a.value.g);
        }
        if (b > 0 && a.value.distance > 0) a.value.distance = Math.max(a.value.distance - b, 0);
        return a;
      };
      this.style.innerShadow = this.style.innerShadow.map(i);
      this.style.innerGlow = this.style.innerGlow.map(i);
    }
  }
  I.f('gradientFill');
  'LayerKind.GRADIENTFILL' == this.ta && 0.01 < this.ga && this.style.gradientFill.push({
    value: Fc(this),
    a: 'layer fill content'
  });
  I.f('borderRadius');
  i = this.Ra;
  ((c = Gc()) ? i = c : ((i = i.name.match(/(\d+)px/i)) && i[1] ? (i = parseFloat(i[1]), i = {
    source: 'radius from layer name',
    X: new ya(new wa(i), new wa(i), new wa(i), new wa(i)),
    bounds: o
  }) : i = {
    X: o,
    bounds: o
  }));
  i.X && this.style.borderRadius.push({
    value: i.X,
    a: 'border radius'
  });
  Hc && (I.f('bounds'), (i.bounds ? this.style.dimensions.push({
    value: {
      top: i.bounds.w,
      left: i.bounds.v,
      width: i.bounds.z - i.bounds.v,
      height: i.bounds.A - i.bounds.w
    },
    a: 'dimensions'
  }) : this.style.dimensions.push({
    value: Ic(),
    a: 'dimensions'
  })));
  I.f('effectsWeCannotRender');
  i = [];
  X('bevelEmboss') && i.push('bevel & emboss');
  X('chromeFX') && i.push('satin');
  X('patternFill') && i.push('pattern overlay');
  i.length && (I.k('Note: CSS Hat currently cannot render ' + i.m() + ', as it is hard to express in CSS.'), this.la = m);
  this.na.length && (I.k('Blending modes are used in ' + this.na.m() + ', but they are impossible to realistically transfer to CSS.'), this.la = m);
  this.Z.length && (I.k(this.Z.m().ea() + ' ' + ((1 < this.Z.length ? 'have' : 'has')) + ' a gradient fill type, but there is no way to express that in CSS, writing the average color instead.'), this.la = m);
  this.ba.length && (I.k(this.ba.m().ea() + ' ' + ((1 < this.ba.length ? 'have' : 'has')) + ' a noise gradient fill type, but there is no way to express that in CSS.'), this.la = m);
  I.ka();
}
function Z(a, b, c, d) {
  for (var e = 0, f = b.length; e < f; ++e) Ub(d, a)(c, b[e].value, b[e].a);
}
function Jc(a, b) {
  var c = '';
  switch (Math.round(a)) {
  case 50:
    c = 'center';
    break;
  case 0:
    c = (b ? 'left' : 'top');
    break;
  case 100:
    c = (b ? 'right' : 'bottom');
    break;
  default:
    c = Math.round(a) + '%';
  }
  return c;
}
function Y(a, b) {
  return W('layerEffects.' + a, b);
}
function X(a) {
  var b = 'layerEffects.' + a + '.enabled',
      c = lc();
  return R(c, b, l, m) && W('layerEffects.' + a + '.enabled');
}
function wc(a, b, c) {
  'normal' != W(((b ? 'layerEffects.' + b + '.' : '')) + 'mode') && a.na.push(c);
}
function zc(a) {
  var b = {
    color: W('adjustment[0].color', 'color')
  };
  b.color.c = a.ga;
  return b;
}
function Fc(a) {
  var b = lc().getList(Q('Adjs')).getObjectValue(0);
  return Ac(a, b, m);
}
function Cc(a) {
  wc(a, 'innerShadow', 'inner shadow');
  return Bc(a, 'innerShadow', 'inner shadow', m, m);
}
function Dc(a) {
  wc(a, 'innerGlow', 'inner glow');
  return Bc(a, 'innerGlow', 'inner glow', p, m);
}
function Ec(a) {
  wc(a, 'outerGlow', 'outer glow');
  return Bc(a, 'outerGlow', 'outer glow');
}
function Bc(a, b, c, d, e) {
  var f = Y(b + '.chokeMatte') / 100,
      g = Y(b + '.blur'),
      e = {
      blur: g * (1 - f),
      g: g * f,
      color: Y(b + '.color', 'color'),
      F: !(!e)
      };
  e.color == o && (a.Z.push(c), c = Ac(a, Y(b)), e.color = Ma(c.gradient));
  c = Y(b + '.opacity') / 100;
  e.color.c = c;
  e.distance = (d ? Y(b + '.distance') : 0);
  e.angle = (d ? (Y(b + '.useGlobalAngle') ? a.globalAngle : Y(b + '.localLightingAngle')) : 0);
  return e;
}
function Ac(a, b, c, d) {
  if (!b) return I.log('Gradient object is missing even though gradient fill is enabled.'), p;
  I.ja('_readPsGradient');
  I.f('get gradient');
  var e = R(b, 'gradient', 'object'),
      f = (c ? a.ga : R(b, 'opacity', 'double') / 100),
      a = new Ia();
  try {
    var g = e.getList(T('colors'));
  } catch (j) {
    return p;
  }
  I.f('get color stops');
  var k, n, c = 0;
  for (k = g.count; c < k; ++c) {
    n = g.getObjectValue(c);
    var t = R(n, 'color', 'color');
    n = new H(100 * n.getInteger(T('location')) / 4096, t);
    a.D.push(n);
  }
  I.f('get opacities');
  e = e.getList(T('transparency'));
  c = 0;
  for (k = e.count; c < k; ++c) n = e.getObjectValue(c), g = new Fa(100 * n.getInteger(T('location')) / 4096, R(n, 'opacity', 'double') / 100 * f), a.G.push(g);
  I.f('overlay with color');
  if (d) {
    c = 0;
    for (e = a.D.length; c < e; c++) f = Ca(a.D[c].color, d), a.D[c].color = f;
    c = 0;
    for (e = a.G.length; c < e; c++) f = a.G[c].opacity, f += (1 - f) * d.c, a.G[c].opacity = f;
  }
  I.f('position, scale ...');
  c = R(b, 'offset', 'offset', m) || {
    horizontal: 0,
    vertical: 0
  };
  e = R(b, 'scale', l, m) || 100;
  d = R(b, 'type') || 'linear';
  f = R(b, 'reverse', l, m);
  I.f('gradientObj');
  I.ja('mergeColorAndOpacity');
  I.f('sort');
  a.sort();
  g = (0 == a.G.length ? Oa : a.G);
  k = (0 == a.D.length ? Na : a.D);
  for (var E = t = n = -1, i = [], w;
  (w = Qa(k, g, E, n, t)) !== o;) n = w.ra, t = w.sa, E = w.h.location, i.push(w.h);
  I.ka();
  f = {
    gradient: a,
    i: i,
    type: d,
    ib: f,
    offset: c,
    scale: e
  };
  I.f('invert');
  if (f.ib) {
    g = f.i.length;
    for (e = 0; e < g; e++) f.i[e].location = 100 - f.i[e].location;
    f.i.sort(function(a, b) {
      return a.location - b.location;
    });
  }
  switch (d) {
  case 'linear':
    I.f('type = linear');
    f.angle = R(b, 'angle');
    break;
  case 'reflected':
    I.f('type = reflected');
    f.angle = R(b, 'angle');
    g = f.i.length;
    for (c = 0; c < g; c++) f.i[c].location = 50 + f.i[c].location / 2;
    for (e = 0; e < g; e++) c = f.i.length - g + e, 50.0005 < f.i[c].location && f.i.unshift({
      color: f.i[c].color,
      location: 100 - f.i[c].location
    });
    break;
  case 'radial':
    I.f('type = radial');
  }
  I.f('angle');
  a.angle && (a.angle = (a.angle + 360) % 360);
  I.ka();
  return f;
}
function Ic() {
  var a = W('bounds', 'rectangle');
  return {
    top: a.top,
    left: a.left,
    width: a.right - a.left,
    height: a.bottom - a.top
  };
}
function Gc() {
  var a;
  try {
    var b = new ActionReference();
    b.putEnumerated(Q('Path'), Q('Path'), T('vectorMask'));
    var c = executeActionGet(b);
    a = R(c, 'pathContents.pathComponents');
    I.log('Layer has layer mask.');
  } catch (d) {
    return p;
  }
  if (!a) return p;
  b = [];
  for (c = 0; c < a.count; ++c) {
    for (var e = {
      v: Infinity,
      z: -Infinity,
      w: Infinity,
      A: -Infinity
    }, f = a.getObjectValue(c).getList(T('subpathListKey')).getObjectValue(0).getList(T('points')), g = [], j = 0; j < f.count; ++j) {
      var k = f.getObjectValue(j).getObjectValue(T('anchor')),
          n = k.getUnitDoubleValue(T('horizontal')),
          t = k.getUnitDoubleValue(T('vertical'));
      k.getUnitDoubleType(T('horizontal'));
      k.getUnitDoubleType(T('horizontal'));
      n < e.v && (e.v = n);
      n > e.z && (e.z = n);
      t < e.w && (e.w = t);
      t > e.A && (e.A = t);
      g.push({
        d: n,
        e: t
      });
    }
    b.push({
      B: g,
      bounds: e
    });
  }
  e = {
    v: Infinity,
    z: -Infinity,
    w: Infinity,
    A: -Infinity
  };
  a = 0;
  for (c = b.length; a < c; a++) if (b[a].bounds.v < e.v && (e.v = b[a].bounds.v), b[a].bounds.w < e.w && (e.w = b[a].bounds.w), b[a].bounds.z > e.z && (e.z = b[a].bounds.z), b[a].bounds.A > e.A) e.A = b[a].bounds.A;
  a = 0;
  for (c = b.length; a < c; a++) if (f = Kc(b[a])) return f;
  return {
    source: o,
    X: o,
    bounds: e
  };
}
function Kc(a) {
  function b(a) {
    (1 == a.length ? a.push(a[0]) : 2 < a.length && a.splice(1, a.length - 2));
    return a;
  }
  function c(a) {
    a.sort(function(a, b) {
      return a.d + a.e - (b.d + b.e);
    });
    return a;
  }
  for (var d = [], e = [], f = [], g = [], j = 0, k = a.B.length; j < k; j++) a.B[j].d < a.bounds.v + 0.0005 && d.push(a.B[j]), a.B[j].d > a.bounds.z - 0.0005 && e.push(a.B[j]), a.B[j].e < a.bounds.w + 0.0005 && f.push(a.B[j]), a.B[j].e > a.bounds.A - 0.0005 && g.push(a.B[j]);
  f = b(c(f));
  d = b(c(d));
  g = b(c(g));
  e = b(c(e));
  return (2 != f.length && 2 != d.length && 2 != g.length && 2 != e.length ? p : {
    source: 'radius from shape',
    X: new ya(ic(f[0], d[0]), ic(f[1], e[0]), ic(g[1], e[1]), ic(g[0], d[1])),
    bounds: a.bounds
  });
};
var Lc = 'nobr a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command data datalist dd del details dfn div dl dt em embed eventsource fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link mark map menu meta meter nav noscript object ol optgroup option output p param pre progress q ruby rp rt s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');
var oc = m,
    Mc = p,
    Hc = m,
    Nc = m,
    xc = m;
I.V = p;
var Q = Xb,
    T = O;

function sc(a, b) {
  this.name = 'KnownError';
  this.Fa = a || '';
  this.message = b || '';
}
sc.prototype = Error.prototype;
var tc = 'NoLayerSelected',
    uc = 'LayerGroupSelected',
    vc = 'UnexpectedLayerType',
    yc = 'NoContentsTextLayer';

function Oc(a) {
  I.bb();
  try {
    var b = a.split(','),
        c = 'true' == b[0],
        d = 'true' == b[1];
    Hc = 'true' == b[2];
    Nc = 'true' == b[3];
    var e = b[4] || 'css';
    Mc = d;
    documents.length || h(new sc('NoDocumentIsOpened'));
    var f = new rc(),
        g = f.gb || '';
    I.ja('LayerStyle.toCssRule');
    var j = new $a(),
        k, n, t = p,
        E = 0,
        i = 0;
    Z(f, f.style.opacity, j, function(a, b, c) {
      M(a, new ub(new pa(b), c));
    });
    var w = f.style.solidFill;
    if (0 < w.length) {
      var s = w[0].value.color,
          r = [w[0].a];
      k = 1;
      for (n = w.length; k < n; ++k) s = Ca(s, w[k].value.color), r.push(w[k].a);
      if (f.p) {
        var q = f.style.gradientFill;
        if (0 < q.length) {
          I.k('CSS cannot express gradient over text, used average gradient color instead.');
          k = 0;
          for (n = q.length; k < n; ++k) s = Ca(s, Ma(q[k].value.gradient)), r.push(q[k].a);
        }
        M(j, new Fb(s, r.join(' + ')));
      } else M(j, new Lb(s, r.join(' + ')));
    }
    var v = f.style.font;
    if (0 < v.length) {
      var C = v[0].value;
      if (C.fa) {
        var da = '<quote>"</quote>' + C.fa + '<quoteEnd>"</quoteEnd>',
            a = o,
            K = ('bold' == C.tb ? 'bold' : 'normal'),
            za = ('italic' == C.style ? 'italic' : 'normal');
        (C.fa.match(/sans/i) ? a = 'sans-serif' : C.fa.match(/serif/i) && (a = 'serif'));
        a && (da += ', ' + a);
        M(j, new Gb(da));
        'normal' != K && M(j, new Ib(K));
        'normal' != za && M(j, new Jb(za));
        C.sb && M(j, new Kb('underline'));
      }
      C.size && M(j, new Hb(new D(C.size, 'px')));
    }
    f.p || Z(f, f.style.stroke, j, function(a, b) {
      switch (b.style) {
      case 'centeredFrame':
        I.k('Stroke is centered and there is no good way to emulate this in CSS, so we render it as inner stroke.');
        break;
      case 'insetFrame':
        E += b.size;
        break;
      case 'outsetFrame':
        i += b.size;
      }
      M(a, new vb(new D(b.size), 'solid', b.color, 'stroke'));
    });
    var Ka = [];
    Z(f, f.style.dropShadow, j, function(a, b, c) {
      (this.p ? (0.0005 < b.g && Ka.push(c), b = nc(b.angle, b.distance, b.blur + b.g, 0, b.color, p, m), M(a, new Pb(b.d, b.e, b.blur, b.color, c)), t = m) : (b = mc(b, i), M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c))));
    });
    Z(f, f.style.outerGlow, j, function(a, b, c) {
      (this.p ? (0.0005 < b.g && Ka.push(c), b = nc(b.angle, b.distance, b.blur + b.g, 0, b.color, p, m), I.Pa(b, 'shadowObj'), M(a, new Pb(b.d, b.e, b.blur, b.color, c)), t = m) : (b = mc(b, i), M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c))));
    });
    f.p || (Z(f, f.style.innerShadow, j, function(a, b, c) {
      b = nc(b.angle, b.distance, b.blur, b.g, b.color, m, p);
      M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c));
    }), Z(f, f.style.innerGlow, j, function(a, b, c) {
      b = nc(0, 0, b.blur, b.g, b.color, m, p);
      M(a, new Ob(b.F, b.d, b.e, b.blur, b.g, b.color, c));
    }));
    Ka.length && I.k('Choke used in text layer\'s ' + Ka.m() + ', but it is not supported in CSS, ignoring.');
    f.p && (t && Mc) && I.k('IE9 doesn\'t support text shadow (and known hacks are slow), skipping.');
    if (!f.p) {
      var S = 100,
          U = 100;
      if (f.style.dimensions.length) {
        var ca = f.style.dimensions[0].value.width,
            ia = f.style.dimensions[0].value.height;
        !isNaN(ca) && 0 < ca && (S = ca);
        !isNaN(ia) && 0 < ia && (U = ia);
      }
      if (Mc && f.style.gradientFill.length) {
        var C = [],
            Sb;
        for (k = f.style.gradientFill.length - 1; 0 <= k; k--) C.push(f.style.gradientFill[k].value), Sb = f.style.gradientFill[k].a;
        var gb;
        a: {
          k = S;
          for (var da = U, K = [], za = [], ca = 0, Aa = C.length; ca < Aa; ca++) {
            for (var B = C[ca], ia = 'hat' + ca, a = '', b = 0, L = B.i.length; b < L; b++) var V = B.i[b],
                a = a + ('<stop offset="' + Math.round(V.location) + '%" stop-color="' + new G(V.color.y, V.color.u, V.color.s, 1).toString() + '" stop-opacity="' + A(V.color.c) + '"/>\n');
            var fb;
            switch (B.type) {
            case 'linear':
            case 'reflected':
              var La = Ra(B.angle),
                  la = B.scale / 100;
              fb = '<linearGradient id="' + ia + '" gradientUnits="objectBoundingBox" x1="' + (50 * la * -La.d + 50 + B.offset.horizontal) + '%" y1="' + (50 * la * -La.e + 50 + B.offset.vertical) + '%" x2="' + (50 * la * La.d + 50 + B.offset.horizontal) + '%" y2="' + (50 * la * La.e + 50 + B.offset.vertical) + '%">\n' + a + '   </linearGradient>\n';
              break;
            case 'radial':
              var pc = 50 + B.offset.horizontal,
                  qc = 50 + B.offset.vertical,
                  la = Math.round(0.5 * B.scale);
              fb = '<radialGradient id="' + ia + '" gradientUnits="userSpaceOnUse" cx="' + pc + '%" cy="' + qc + '%" r="' + la + '%" >\n' + a + '</radialGradient>\n';
              break;
            default:
              var bc = 'Sorry, ' + B.type + ' gradient type is not supported for SVG export.';
              I.k(bc);
              gb = '/* ' + bc + ' */';
              break a;
            }
            K.push(fb);
            za.push('<rect x="0" y="0" width="' + Math.round(k) + '" height="' + Math.round(da) + '" fill="url(#' + ia + ')" />');
          }
          var ra = '<?xml version="1.0" ?>\n<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ' + Math.round(k) + ' ' + Math.round(da) + '" preserveAspectRatio="none">' + K.join('\n') + '\n' + za.join('\n') + '\n</svg>',
              Aa = '',
              wb, Sa, Ta, cc, dc, xb, Ua, B = 0,
              yb;
          yb = ra.replace(/\r\n/g, '\n');
          L = '';
          for (V = 0; V < yb.length; V++) {
            var ga = yb.charCodeAt(V);
            (128 > ga ? L += String.fromCharCode(ga) : ((127 < ga && 2048 > ga ? L += String.fromCharCode(ga >> 6 | 192) : (L += String.fromCharCode(ga >> 12 | 224), L += String.fromCharCode(ga >> 6 & 63 | 128))), L += String.fromCharCode(ga & 63 | 128)));
          }
          for (ra = L; B < ra.length;) wb = ra.charCodeAt(B++), Sa = ra.charCodeAt(B++), Ta = ra.charCodeAt(B++), cc = wb >> 2, dc = (wb & 3) << 4 | Sa >> 4, xb = (Sa & 15) << 2 | Ta >> 6, Ua = Ta & 63, (isNaN(Sa) ? xb = Ua = 64 : isNaN(Ta) && (Ua = 64)), Aa = Aa + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(cc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(dc) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(xb) + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.charAt(Ua);
          gb = 'url(data:image/svg+xml;base64,' + Aa + ')';
        }
        M(j, new Qb(gb, Sb));
      }
      Z(f, f.style.gradientFill, j, function(a, b, c) {
        var d, e = S / 2;
        d = U / 2;
        var f = b.angle,
            g = Ra(f),
            g = Math.sqrt((S * (g.d + 1) * 0.5 - e) * (S * (g.d + 1) * 0.5 - e) + (U * (g.e + 1) * 0.5 - d) * (U * (g.e + 1) * 0.5 - d)),
            i = Math.sqrt((jc(b.offset.horizontal) * 0.01 * S - e - 0) * (jc(b.offset.horizontal) * 0.01 * S - e - 0) + (jc(b.offset.vertical) * 0.01 * U - d - 0) * (jc(b.offset.vertical) * 0.01 * U - d - 0)),
            e = f - (Math.atan2(jc(b.offset.horizontal) * 0.01 * S - e, jc(b.offset.vertical) * 0.01 * U - d) / Math.PI * 180 + 360) % 360;
        e >= 180 && (e = e - 360);
        d = i * Math.cos((e + 90) * Math.PI / 180) / g;
        for (var f = b.scale / 100, g = [], e = [], i = 0, j = b.i.length; i < j; i++) {
          g.push(b.i[i].color.toString() + ' ' + A((b.i[i].location - 50) * f + 50 + 100 * d) + '%');
          e.push(b.i[i].color.toString() + ' ' + A(b.i[i].location) + '%');
        }
        d = g.join(', ');
        e = e.join(', ');
        switch (b.type) {
        case 'reflected':
        case 'linear':
          M(a, new Rb(new Ga(b.angle), d, c));
          break;
        case 'radial':
          d = Jc(jc(b.offset.horizontal), m) + ' ' + Jc(jc(b.offset.vertical), p);
          f = Math.round(b.scale * 0.5);
          f = f + '% ' + f + '%';
          f = b.scale * 0.01 * Math.min(S, U);
          f = ua(f) + ' ' + ua(f);
          Mc && (!F(b.offset.horizontal, 50) && !F(b.offset.vertical, 50) && !F(b.scale, 100)) && I.k('Firefox has no way to specify gradient with nonstandard scale and position - take care and test, you\'re in uncharted waters.');
          M(a, new Tb(d + ', ' + f + ', ' + e, d + ', circle, ' + e, c));
          break;
        default:
          I.k('We are sorry, ' + b.type + ' gradient style is currently not supported. Write us at team@csspiffle.com.');
        }
      });
    }
    f.p || Z(f, f.style.dimensions, j, function(a, b) {
      !F(b.width, 0) && !F(b.height, 0) && M(a, new tb(new D(b.width - 2 * E), new D(b.height - 2 * E)));
    });
    f.p || Z(f, f.style.borderRadius, j, function(a, b, c) {
      if (!b.J()) {
        if (i > 0.0005) {
          xa(b.Va, i);
          xa(b.Wa, i);
          xa(b.Ca, i);
          xa(b.Da, i);
        }(b.source == 'radius from layer name' ? c = 'from layer name' : b.source == 'radius from shape' && (c = 'from vector shape'));
        M(a, new Eb(b, c));
      }
    });
    I.ka();
    var zb;
    if (Nc) {
      var ec = f.name,
          Ab, Va = [],
          Bb = m;
      ec.split(/ +/).forEach(function(a) {
        switch (a.Ia()) {
        case '.':
        case '#':
        case ':':
        case '~':
        case '=':
        case '^=':
        case '$=':
        case '*=':
          Va.push(a);
          break;
        default:
          if (a == '^=' || a == '$=' || a == '*=' || a == '+') Va.push(a);
          else {
            a.match(/,|^[0-9+]$/) && (Bb = p);
            var b = a.match(/\w+/);
            if (b) {
              a: {
                for (var c = 0, d = Lc.length; c < d; c++) if (b[0].toLowerCase() == Lc[c]) {
                  b = m;
                  break a;
                }
                b = p;
              }(b ? Va.push(a.toLowerCase()) : Bb = p);
            }
          }
        }
      });
      Ab = (Bb ? Va.join(' ') : o);
      var Cb;
      if (Ab != o) Cb = Ab;
      else {
        var Db = ec.toLowerCase().replace(/^[^a-zA-Z]+/, '').replace(/([^0-9a-zA-Z]+)$/, '').replace(RegExp('[^0-9a-zA-Z]+', 'g'), '-');
        '' === Db && (Db = 'layer');
        Cb = '.' + Db;
      }
      zb = nb(j, m, Cb, e, c, d);
    } else zb = nb(j, p, l, e, c, d);
    return {
      response: zb,
      layerId: g,
      error: '',
      knownError: '',
      fullError: '',
      log: I.Ja(),
      warn: I.Ka()
    };
  } catch (sa) {
    return {
      response: '',
      layerId: '',
      error: ('KnownError' == sa.name ? 'Known error: ' + sa.Fa + ' - ' + sa.message : I.Ga(sa)),
      knownError: ('KnownError' == sa.name ? sa.Fa : ''),
      fullError: '',
      log: I.Ja(),
      warn: I.Ka()
    };
  }
}
this.generateCssForActiveLayerXml = function(a) {
  var a = Oc(a),
      b;
  b = '<object>';
  for (var c in a) a.hasOwnProperty(c) && (b += P(a[c], c));
  return b + '</object>';
};
this.generateCssForActiveLayerJson = function(a) {
  return Oc(a);
};
this.getOptions = function() {
  return '<object>' + P(app.version.toString(), 'version') + P($.os.toString(), 'os') + P('7bb92719edc5ae4f998e7a260ac8b5a6a3a8a1aee7b6ab7dd58d9c845a570127', 'hash') + P('master', 'branch') + P(p, 'debug') + P('stable', 'channel') + '</object>';
};
this.getHistory = function() {
  var a = o,
      b = o;
  try {
    a = app.activeDocument, b = a.activeLayer;
  } catch (c) {}
  var d = (a ? a.name : ''),
      b = (b ? b.name : '');
  return '<object>' + P((a ? a.historyStates.length : -1), 'historyLength') + P(d, 'documentName') + P(b, 'layerName') + '</object>';
};