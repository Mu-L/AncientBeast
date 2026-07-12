var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    var base64 = exports2;
    base64.length = function length(string) {
      var p = string.length;
      if (!p)
        return 0;
      var n = 0;
      while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
      return Math.ceil(string.length * 3) / 4 - n;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base64.encode = function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base64.decode = function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base64.test = function test(string) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
  }
});

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = /* @__PURE__ */ Object.create(null);
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = /* @__PURE__ */ Object.create(null);
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          if (!listeners)
            return this;
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports3;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "node_modules/@protobufjs/inquire/index.js"(exports2, module2) {
    "use strict";
    module2.exports = inquire;
    function inquire(moduleName) {
      try {
        if (typeof require !== "function") {
          return null;
        }
        var mod = require(moduleName);
        if (mod && (mod.length || Object.keys(mod).length)) return mod;
        return null;
      } catch (err) {
        return null;
      }
    }
  }
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    var utf8 = exports2;
    var replacementCharCode = 65533;
    utf8.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf8.read = function utf8_read(buffer, start, end) {
      if (end - start < 1)
        return "";
      var parts = null, chunk = [], i = 0, t, t2, c2, c3;
      while (start < end) {
        t = buffer[start++];
        if (t <= 127) {
          chunk[i++] = t;
        } else if (t >= 192 && t < 224) {
          c2 = (t & 31) << 6 | buffer[start++] & 63;
          chunk[i++] = c2 >= 128 ? c2 : replacementCharCode;
        } else if (t >= 224 && t < 240) {
          c3 = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
          chunk[i++] = c3 >= 2048 ? c3 : replacementCharCode;
        } else if (t >= 240) {
          t2 = (t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
          if (t2 < 65536 || t2 > 1114111)
            chunk[i++] = replacementCharCode;
          else {
            t2 -= 65536;
            chunk[i++] = 55296 + (t2 >> 10);
            chunk[i++] = 56320 + (t2 & 1023);
          }
        }
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk.slice(0, i)));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf8.write = function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    module2.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
  }
});

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber2(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber2(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// node_modules/long/umd/index.js
var require_umd = __commonJS({
  "node_modules/long/umd/index.js"(exports2, module2) {
    (function(global2, factory) {
      function preferDefault(exports3) {
        return exports3.default || exports3;
      }
      if (typeof define === "function" && define.amd) {
        define([], function() {
          var exports3 = {};
          factory(exports3);
          return preferDefault(exports3);
        });
      } else if (typeof exports2 === "object") {
        factory(exports2);
        if (typeof module2 === "object") module2.exports = preferDefault(exports2);
      } else {
        (function() {
          var exports3 = {};
          factory(exports3);
          global2.Long = preferDefault(exports3);
        })();
      }
    })(
      typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports2,
      function(_exports) {
        "use strict";
        Object.defineProperty(_exports, "__esModule", {
          value: true
        });
        _exports.default = void 0;
        var wasm2 = null;
        try {
          wasm2 = new WebAssembly.Instance(
            new WebAssembly.Module(
              new Uint8Array([
                // \0asm
                0,
                97,
                115,
                109,
                // version 1
                1,
                0,
                0,
                0,
                // section "type"
                1,
                13,
                2,
                // 0, () => i32
                96,
                0,
                1,
                127,
                // 1, (i32, i32, i32, i32) => i32
                96,
                4,
                127,
                127,
                127,
                127,
                1,
                127,
                // section "function"
                3,
                7,
                6,
                // 0, type 0
                0,
                // 1, type 1
                1,
                // 2, type 1
                1,
                // 3, type 1
                1,
                // 4, type 1
                1,
                // 5, type 1
                1,
                // section "global"
                6,
                6,
                1,
                // 0, "high", mutable i32
                127,
                1,
                65,
                0,
                11,
                // section "export"
                7,
                50,
                6,
                // 0, "mul"
                3,
                109,
                117,
                108,
                0,
                1,
                // 1, "div_s"
                5,
                100,
                105,
                118,
                95,
                115,
                0,
                2,
                // 2, "div_u"
                5,
                100,
                105,
                118,
                95,
                117,
                0,
                3,
                // 3, "rem_s"
                5,
                114,
                101,
                109,
                95,
                115,
                0,
                4,
                // 4, "rem_u"
                5,
                114,
                101,
                109,
                95,
                117,
                0,
                5,
                // 5, "get_high"
                8,
                103,
                101,
                116,
                95,
                104,
                105,
                103,
                104,
                0,
                0,
                // section "code"
                10,
                191,
                1,
                6,
                // 0, "get_high"
                4,
                0,
                35,
                0,
                11,
                // 1, "mul"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                126,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 2, "div_s"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                127,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 3, "div_u"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                128,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 4, "rem_s"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                129,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 5, "rem_u"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                130,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11
              ])
            ),
            {}
          ).exports;
        } catch {
        }
        function Long2(low, high, unsigned) {
          this.low = low | 0;
          this.high = high | 0;
          this.unsigned = !!unsigned;
        }
        Long2.prototype.__isLong__;
        Object.defineProperty(Long2.prototype, "__isLong__", {
          value: true
        });
        function isLong2(obj) {
          return (obj && obj["__isLong__"]) === true;
        }
        function ctz322(value) {
          var c = Math.clz32(value & -value);
          return value ? 31 - c : c;
        }
        Long2.isLong = isLong2;
        var INT_CACHE2 = {};
        var UINT_CACHE2 = {};
        function fromInt2(value, unsigned) {
          var obj, cachedObj, cache;
          if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
              cachedObj = UINT_CACHE2[value];
              if (cachedObj) return cachedObj;
            }
            obj = fromBits2(value, 0, true);
            if (cache) UINT_CACHE2[value] = obj;
            return obj;
          } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
              cachedObj = INT_CACHE2[value];
              if (cachedObj) return cachedObj;
            }
            obj = fromBits2(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE2[value] = obj;
            return obj;
          }
        }
        Long2.fromInt = fromInt2;
        function fromNumber2(value, unsigned) {
          if (isNaN(value)) return unsigned ? UZERO2 : ZERO2;
          if (unsigned) {
            if (value < 0) return UZERO2;
            if (value >= TWO_PWR_64_DBL2) return MAX_UNSIGNED_VALUE2;
          } else {
            if (value <= -TWO_PWR_63_DBL2) return MIN_VALUE2;
            if (value + 1 >= TWO_PWR_63_DBL2) return MAX_VALUE2;
          }
          if (value < 0) return fromNumber2(-value, unsigned).neg();
          return fromBits2(
            value % TWO_PWR_32_DBL2 | 0,
            value / TWO_PWR_32_DBL2 | 0,
            unsigned
          );
        }
        Long2.fromNumber = fromNumber2;
        function fromBits2(lowBits, highBits, unsigned) {
          return new Long2(lowBits, highBits, unsigned);
        }
        Long2.fromBits = fromBits2;
        var pow_dbl2 = Math.pow;
        function fromString2(str, unsigned, radix) {
          if (str.length === 0) throw Error("empty string");
          if (typeof unsigned === "number") {
            radix = unsigned;
            unsigned = false;
          } else {
            unsigned = !!unsigned;
          }
          if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return unsigned ? UZERO2 : ZERO2;
          radix = radix || 10;
          if (radix < 2 || 36 < radix) throw RangeError("radix");
          var p;
          if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
          else if (p === 0) {
            return fromString2(str.substring(1), unsigned, radix).neg();
          }
          var radixToPower = fromNumber2(pow_dbl2(radix, 8));
          var result = ZERO2;
          for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
              var power = fromNumber2(pow_dbl2(radix, size));
              result = result.mul(power).add(fromNumber2(value));
            } else {
              result = result.mul(radixToPower);
              result = result.add(fromNumber2(value));
            }
          }
          result.unsigned = unsigned;
          return result;
        }
        Long2.fromString = fromString2;
        function fromValue2(val, unsigned) {
          if (typeof val === "number") return fromNumber2(val, unsigned);
          if (typeof val === "string") return fromString2(val, unsigned);
          return fromBits2(
            val.low,
            val.high,
            typeof unsigned === "boolean" ? unsigned : val.unsigned
          );
        }
        Long2.fromValue = fromValue2;
        var TWO_PWR_16_DBL2 = 1 << 16;
        var TWO_PWR_24_DBL2 = 1 << 24;
        var TWO_PWR_32_DBL2 = TWO_PWR_16_DBL2 * TWO_PWR_16_DBL2;
        var TWO_PWR_64_DBL2 = TWO_PWR_32_DBL2 * TWO_PWR_32_DBL2;
        var TWO_PWR_63_DBL2 = TWO_PWR_64_DBL2 / 2;
        var TWO_PWR_242 = fromInt2(TWO_PWR_24_DBL2);
        var ZERO2 = fromInt2(0);
        Long2.ZERO = ZERO2;
        var UZERO2 = fromInt2(0, true);
        Long2.UZERO = UZERO2;
        var ONE2 = fromInt2(1);
        Long2.ONE = ONE2;
        var UONE2 = fromInt2(1, true);
        Long2.UONE = UONE2;
        var NEG_ONE2 = fromInt2(-1);
        Long2.NEG_ONE = NEG_ONE2;
        var MAX_VALUE2 = fromBits2(4294967295 | 0, 2147483647 | 0, false);
        Long2.MAX_VALUE = MAX_VALUE2;
        var MAX_UNSIGNED_VALUE2 = fromBits2(4294967295 | 0, 4294967295 | 0, true);
        Long2.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE2;
        var MIN_VALUE2 = fromBits2(0, 2147483648 | 0, false);
        Long2.MIN_VALUE = MIN_VALUE2;
        var LongPrototype2 = Long2.prototype;
        LongPrototype2.toInt = function toInt2() {
          return this.unsigned ? this.low >>> 0 : this.low;
        };
        LongPrototype2.toNumber = function toNumber2() {
          if (this.unsigned)
            return (this.high >>> 0) * TWO_PWR_32_DBL2 + (this.low >>> 0);
          return this.high * TWO_PWR_32_DBL2 + (this.low >>> 0);
        };
        LongPrototype2.toString = function toString2(radix) {
          radix = radix || 10;
          if (radix < 2 || 36 < radix) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(MIN_VALUE2)) {
              var radixLong = fromNumber2(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
              return div.toString(radix) + rem1.toInt().toString(radix);
            } else return "-" + this.neg().toString(radix);
          }
          var radixToPower = fromNumber2(pow_dbl2(radix, 6), this.unsigned), rem = this;
          var result = "";
          while (true) {
            var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;
            else {
              while (digits.length < 6) digits = "0" + digits;
              result = "" + digits + result;
            }
          }
        };
        LongPrototype2.getHighBits = function getHighBits2() {
          return this.high;
        };
        LongPrototype2.getHighBitsUnsigned = function getHighBitsUnsigned2() {
          return this.high >>> 0;
        };
        LongPrototype2.getLowBits = function getLowBits2() {
          return this.low;
        };
        LongPrototype2.getLowBitsUnsigned = function getLowBitsUnsigned2() {
          return this.low >>> 0;
        };
        LongPrototype2.getNumBitsAbs = function getNumBitsAbs2() {
          if (this.isNegative())
            return this.eq(MIN_VALUE2) ? 64 : this.neg().getNumBitsAbs();
          var val = this.high != 0 ? this.high : this.low;
          for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
          return this.high != 0 ? bit + 33 : bit + 1;
        };
        LongPrototype2.isSafeInteger = function isSafeInteger2() {
          var top11Bits = this.high >> 21;
          if (!top11Bits) return true;
          if (this.unsigned) return false;
          return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
        };
        LongPrototype2.isZero = function isZero2() {
          return this.high === 0 && this.low === 0;
        };
        LongPrototype2.eqz = LongPrototype2.isZero;
        LongPrototype2.isNegative = function isNegative2() {
          return !this.unsigned && this.high < 0;
        };
        LongPrototype2.isPositive = function isPositive2() {
          return this.unsigned || this.high >= 0;
        };
        LongPrototype2.isOdd = function isOdd2() {
          return (this.low & 1) === 1;
        };
        LongPrototype2.isEven = function isEven2() {
          return (this.low & 1) === 0;
        };
        LongPrototype2.equals = function equals2(other) {
          if (!isLong2(other)) other = fromValue2(other);
          if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
            return false;
          return this.high === other.high && this.low === other.low;
        };
        LongPrototype2.eq = LongPrototype2.equals;
        LongPrototype2.notEquals = function notEquals2(other) {
          return !this.eq(
            /* validates */
            other
          );
        };
        LongPrototype2.neq = LongPrototype2.notEquals;
        LongPrototype2.ne = LongPrototype2.notEquals;
        LongPrototype2.lessThan = function lessThan2(other) {
          return this.comp(
            /* validates */
            other
          ) < 0;
        };
        LongPrototype2.lt = LongPrototype2.lessThan;
        LongPrototype2.lessThanOrEqual = function lessThanOrEqual2(other) {
          return this.comp(
            /* validates */
            other
          ) <= 0;
        };
        LongPrototype2.lte = LongPrototype2.lessThanOrEqual;
        LongPrototype2.le = LongPrototype2.lessThanOrEqual;
        LongPrototype2.greaterThan = function greaterThan2(other) {
          return this.comp(
            /* validates */
            other
          ) > 0;
        };
        LongPrototype2.gt = LongPrototype2.greaterThan;
        LongPrototype2.greaterThanOrEqual = function greaterThanOrEqual2(other) {
          return this.comp(
            /* validates */
            other
          ) >= 0;
        };
        LongPrototype2.gte = LongPrototype2.greaterThanOrEqual;
        LongPrototype2.ge = LongPrototype2.greaterThanOrEqual;
        LongPrototype2.compare = function compare2(other) {
          if (!isLong2(other)) other = fromValue2(other);
          if (this.eq(other)) return 0;
          var thisNeg = this.isNegative(), otherNeg = other.isNegative();
          if (thisNeg && !otherNeg) return -1;
          if (!thisNeg && otherNeg) return 1;
          if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
          return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
        };
        LongPrototype2.comp = LongPrototype2.compare;
        LongPrototype2.negate = function negate2() {
          if (!this.unsigned && this.eq(MIN_VALUE2)) return MIN_VALUE2;
          return this.not().add(ONE2);
        };
        LongPrototype2.neg = LongPrototype2.negate;
        LongPrototype2.add = function add2(addend) {
          if (!isLong2(addend)) addend = fromValue2(addend);
          var a48 = this.high >>> 16;
          var a32 = this.high & 65535;
          var a16 = this.low >>> 16;
          var a00 = this.low & 65535;
          var b48 = addend.high >>> 16;
          var b32 = addend.high & 65535;
          var b16 = addend.low >>> 16;
          var b00 = addend.low & 65535;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 + b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 + b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 + b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 + b48;
          c48 &= 65535;
          return fromBits2(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        };
        LongPrototype2.subtract = function subtract2(subtrahend) {
          if (!isLong2(subtrahend)) subtrahend = fromValue2(subtrahend);
          return this.add(subtrahend.neg());
        };
        LongPrototype2.sub = LongPrototype2.subtract;
        LongPrototype2.multiply = function multiply2(multiplier) {
          if (this.isZero()) return this;
          if (!isLong2(multiplier)) multiplier = fromValue2(multiplier);
          if (wasm2) {
            var low = wasm2["mul"](
              this.low,
              this.high,
              multiplier.low,
              multiplier.high
            );
            return fromBits2(low, wasm2["get_high"](), this.unsigned);
          }
          if (multiplier.isZero()) return this.unsigned ? UZERO2 : ZERO2;
          if (this.eq(MIN_VALUE2)) return multiplier.isOdd() ? MIN_VALUE2 : ZERO2;
          if (multiplier.eq(MIN_VALUE2)) return this.isOdd() ? MIN_VALUE2 : ZERO2;
          if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
            else return this.neg().mul(multiplier).neg();
          } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
          if (this.lt(TWO_PWR_242) && multiplier.lt(TWO_PWR_242))
            return fromNumber2(
              this.toNumber() * multiplier.toNumber(),
              this.unsigned
            );
          var a48 = this.high >>> 16;
          var a32 = this.high & 65535;
          var a16 = this.low >>> 16;
          var a00 = this.low & 65535;
          var b48 = multiplier.high >>> 16;
          var b32 = multiplier.high & 65535;
          var b16 = multiplier.low >>> 16;
          var b00 = multiplier.low & 65535;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 * b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 * b00;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c16 += a00 * b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 * b00;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a16 * b16;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a00 * b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
          c48 &= 65535;
          return fromBits2(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        };
        LongPrototype2.mul = LongPrototype2.multiply;
        LongPrototype2.divide = function divide2(divisor) {
          if (!isLong2(divisor)) divisor = fromValue2(divisor);
          if (divisor.isZero()) throw Error("division by zero");
          if (wasm2) {
            if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
              return this;
            }
            var low = (this.unsigned ? wasm2["div_u"] : wasm2["div_s"])(
              this.low,
              this.high,
              divisor.low,
              divisor.high
            );
            return fromBits2(low, wasm2["get_high"](), this.unsigned);
          }
          if (this.isZero()) return this.unsigned ? UZERO2 : ZERO2;
          var approx, rem, res;
          if (!this.unsigned) {
            if (this.eq(MIN_VALUE2)) {
              if (divisor.eq(ONE2) || divisor.eq(NEG_ONE2))
                return MIN_VALUE2;
              else if (divisor.eq(MIN_VALUE2)) return ONE2;
              else {
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO2)) {
                  return divisor.isNegative() ? ONE2 : NEG_ONE2;
                } else {
                  rem = this.sub(divisor.mul(approx));
                  res = approx.add(rem.div(divisor));
                  return res;
                }
              }
            } else if (divisor.eq(MIN_VALUE2)) return this.unsigned ? UZERO2 : ZERO2;
            if (this.isNegative()) {
              if (divisor.isNegative()) return this.neg().div(divisor.neg());
              return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO2;
          } else {
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO2;
            if (divisor.gt(this.shru(1)))
              return UONE2;
            res = UZERO2;
          }
          rem = this;
          while (rem.gte(divisor)) {
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl2(2, log2 - 48), approxRes = fromNumber2(approx), approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
              approx -= delta;
              approxRes = fromNumber2(approx, this.unsigned);
              approxRem = approxRes.mul(divisor);
            }
            if (approxRes.isZero()) approxRes = ONE2;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
          }
          return res;
        };
        LongPrototype2.div = LongPrototype2.divide;
        LongPrototype2.modulo = function modulo2(divisor) {
          if (!isLong2(divisor)) divisor = fromValue2(divisor);
          if (wasm2) {
            var low = (this.unsigned ? wasm2["rem_u"] : wasm2["rem_s"])(
              this.low,
              this.high,
              divisor.low,
              divisor.high
            );
            return fromBits2(low, wasm2["get_high"](), this.unsigned);
          }
          return this.sub(this.div(divisor).mul(divisor));
        };
        LongPrototype2.mod = LongPrototype2.modulo;
        LongPrototype2.rem = LongPrototype2.modulo;
        LongPrototype2.not = function not2() {
          return fromBits2(~this.low, ~this.high, this.unsigned);
        };
        LongPrototype2.countLeadingZeros = function countLeadingZeros2() {
          return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
        };
        LongPrototype2.clz = LongPrototype2.countLeadingZeros;
        LongPrototype2.countTrailingZeros = function countTrailingZeros2() {
          return this.low ? ctz322(this.low) : ctz322(this.high) + 32;
        };
        LongPrototype2.ctz = LongPrototype2.countTrailingZeros;
        LongPrototype2.and = function and2(other) {
          if (!isLong2(other)) other = fromValue2(other);
          return fromBits2(
            this.low & other.low,
            this.high & other.high,
            this.unsigned
          );
        };
        LongPrototype2.or = function or2(other) {
          if (!isLong2(other)) other = fromValue2(other);
          return fromBits2(
            this.low | other.low,
            this.high | other.high,
            this.unsigned
          );
        };
        LongPrototype2.xor = function xor2(other) {
          if (!isLong2(other)) other = fromValue2(other);
          return fromBits2(
            this.low ^ other.low,
            this.high ^ other.high,
            this.unsigned
          );
        };
        LongPrototype2.shiftLeft = function shiftLeft2(numBits) {
          if (isLong2(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          else if (numBits < 32)
            return fromBits2(
              this.low << numBits,
              this.high << numBits | this.low >>> 32 - numBits,
              this.unsigned
            );
          else return fromBits2(0, this.low << numBits - 32, this.unsigned);
        };
        LongPrototype2.shl = LongPrototype2.shiftLeft;
        LongPrototype2.shiftRight = function shiftRight2(numBits) {
          if (isLong2(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          else if (numBits < 32)
            return fromBits2(
              this.low >>> numBits | this.high << 32 - numBits,
              this.high >> numBits,
              this.unsigned
            );
          else
            return fromBits2(
              this.high >> numBits - 32,
              this.high >= 0 ? 0 : -1,
              this.unsigned
            );
        };
        LongPrototype2.shr = LongPrototype2.shiftRight;
        LongPrototype2.shiftRightUnsigned = function shiftRightUnsigned2(numBits) {
          if (isLong2(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits < 32)
            return fromBits2(
              this.low >>> numBits | this.high << 32 - numBits,
              this.high >>> numBits,
              this.unsigned
            );
          if (numBits === 32) return fromBits2(this.high, 0, this.unsigned);
          return fromBits2(this.high >>> numBits - 32, 0, this.unsigned);
        };
        LongPrototype2.shru = LongPrototype2.shiftRightUnsigned;
        LongPrototype2.shr_u = LongPrototype2.shiftRightUnsigned;
        LongPrototype2.rotateLeft = function rotateLeft2(numBits) {
          var b;
          if (isLong2(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits === 32) return fromBits2(this.high, this.low, this.unsigned);
          if (numBits < 32) {
            b = 32 - numBits;
            return fromBits2(
              this.low << numBits | this.high >>> b,
              this.high << numBits | this.low >>> b,
              this.unsigned
            );
          }
          numBits -= 32;
          b = 32 - numBits;
          return fromBits2(
            this.high << numBits | this.low >>> b,
            this.low << numBits | this.high >>> b,
            this.unsigned
          );
        };
        LongPrototype2.rotl = LongPrototype2.rotateLeft;
        LongPrototype2.rotateRight = function rotateRight2(numBits) {
          var b;
          if (isLong2(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits === 32) return fromBits2(this.high, this.low, this.unsigned);
          if (numBits < 32) {
            b = 32 - numBits;
            return fromBits2(
              this.high << b | this.low >>> numBits,
              this.low << b | this.high >>> numBits,
              this.unsigned
            );
          }
          numBits -= 32;
          b = 32 - numBits;
          return fromBits2(
            this.low << b | this.high >>> numBits,
            this.high << b | this.low >>> numBits,
            this.unsigned
          );
        };
        LongPrototype2.rotr = LongPrototype2.rotateRight;
        LongPrototype2.toSigned = function toSigned2() {
          if (!this.unsigned) return this;
          return fromBits2(this.low, this.high, false);
        };
        LongPrototype2.toUnsigned = function toUnsigned2() {
          if (this.unsigned) return this;
          return fromBits2(this.low, this.high, true);
        };
        LongPrototype2.toBytes = function toBytes2(le) {
          return le ? this.toBytesLE() : this.toBytesBE();
        };
        LongPrototype2.toBytesLE = function toBytesLE2() {
          var hi = this.high, lo = this.low;
          return [
            lo & 255,
            lo >>> 8 & 255,
            lo >>> 16 & 255,
            lo >>> 24,
            hi & 255,
            hi >>> 8 & 255,
            hi >>> 16 & 255,
            hi >>> 24
          ];
        };
        LongPrototype2.toBytesBE = function toBytesBE2() {
          var hi = this.high, lo = this.low;
          return [
            hi >>> 24,
            hi >>> 16 & 255,
            hi >>> 8 & 255,
            hi & 255,
            lo >>> 24,
            lo >>> 16 & 255,
            lo >>> 8 & 255,
            lo & 255
          ];
        };
        Long2.fromBytes = function fromBytes2(bytes, unsigned, le) {
          return le ? Long2.fromBytesLE(bytes, unsigned) : Long2.fromBytesBE(bytes, unsigned);
        };
        Long2.fromBytesLE = function fromBytesLE2(bytes, unsigned) {
          return new Long2(
            bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
            bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
            unsigned
          );
        };
        Long2.fromBytesBE = function fromBytesBE2(bytes, unsigned) {
          return new Long2(
            bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
            bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
            unsigned
          );
        };
        if (typeof BigInt === "function") {
          Long2.fromBigInt = function fromBigInt(value, unsigned) {
            var lowBits = Number(BigInt.asIntN(32, value));
            var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
            return fromBits2(lowBits, highBits, unsigned);
          };
          Long2.fromValue = function fromValueWithBigInt(value, unsigned) {
            if (typeof value === "bigint") return Long2.fromBigInt(value, unsigned);
            return fromValue2(value, unsigned);
          };
          LongPrototype2.toBigInt = function toBigInt() {
            var lowBigInt = BigInt(this.low >>> 0);
            var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return highBigInt << BigInt(32) | lowBigInt;
          };
        }
        var _default = _exports.default = Long2;
      }
    );
  }
});

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    function isUnsafeProperty(key) {
      return key === "__proto__" || key === "prototype" || key === "constructor";
    }
    util.isUnsafeProperty = isUnsafeProperty;
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject2(value) {
      return value && typeof value === "object";
    };
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet3(obj, prop) {
      var value = obj[prop];
      if (value != null && Object.hasOwnProperty.call(obj, prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = function() {
      try {
        var Buffer2 = util.global.Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    }();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || function() {
      try {
        var Long2 = require_umd();
        return Long2 && Long2.isLong ? Long2 : null;
      } catch (e) {
        return null;
      }
    }();
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst) {
      var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
      ifNotSet = ifNotSet && arguments[arguments.length - 1];
      for (var a = 1; a < limit; ++a) {
        var src = arguments[a];
        if (!src)
          continue;
        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
          if (!isUnsafeProperty(keys[i]) && (dst[keys[i]] === void 0 || !ifNotSet))
            dst[keys[i]] = src[keys[i]];
      }
      return dst;
    }
    util.merge = merge;
    util.nestingLimit = 32;
    util.recursionLimit = 100;
    util.makeProp = function makeProp(obj, key) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true
      });
    };
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: function get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: function value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      };
    };
  }
});

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return (value |= 0) < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      var lo = val.lo, hi = val.hi;
      while (hi) {
        buf[pos++] = lo & 127 | 128;
        lo = (lo >>> 7 | hi << 25) >>> 0;
        hi >>>= 7;
      }
      while (lo > 127) {
        buf[pos++] = lo & 127 | 128;
        lo = lo >>> 7;
      }
      buf[pos++] = lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length; )
          buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    } : function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        })(buffer);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = /* @__PURE__ */ function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      if (start === end) {
        var nativeBuffer = util.Buffer;
        return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
      }
      return this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf8.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.recursionLimit = util.recursionLimit;
    Reader.prototype.skipType = function(wireType, depth) {
      if (depth === void 0) depth = 0;
      if (depth > Reader.recursionLimit)
        throw Error("maximum nesting depth exceeded");
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType, depth + 1);
          }
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    module2.exports = /* @__PURE__ */ Object.create(null);
  }
});

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    var protobuf = exports2;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  }
});

// node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "node_modules/protobufjs/minimal.js"(exports2, module2) {
    "use strict";
    module2.exports = require_index_minimal();
  }
});

// node_modules/@devvit/server/context.js
var import_node_async_hooks = require("node:async_hooks");
var requestContextStorage;
try {
  requestContextStorage = new import_node_async_hooks.AsyncLocalStorage();
} catch {
}
function getContext() {
  const ctx = requestContextStorage.getStore();
  if (!ctx) {
    throw new Error("No context found. Are you calling `createServer` Is this code running as part of a server request?");
  }
  return ctx;
}
function getMetadata() {
  const ctx = requestContextStorage.getStore();
  if (!ctx) {
    return void 0;
  }
  return ctx.metadata;
}
async function runWithContext(context2, callback) {
  return requestContextStorage.run(context2, callback);
}
var context = new Proxy({}, {
  get: (_target, prop) => {
    const context2 = getContext();
    return context2[prop];
  },
  // The following two methods set up the Proxy to behave like a normal object when iterating over keys or
  // checking if a property exists. (This helps ensure tests pass too.)
  ownKeys() {
    return Object.keys(getContext());
  },
  getOwnPropertyDescriptor(_target, key) {
    return { enumerable: true, configurable: true, value: getContext()[key] };
  }
});

// node_modules/@devvit/server/create-server.js
var import_node_http = require("node:http");

// node_modules/@devvit/shared-types/Header.js
var Header = Object.freeze({
  Actor: "devvit-actor",
  App: "devvit-app",
  AppUser: "devvit-app-user",
  Canary: "devvit-canary",
  Comment: "devvit-comment",
  Context: "devvit-context",
  Debug: "devvit-debug",
  ElysiumInstallationOverride: "devvit-elysium-installation-override",
  FeaturedGames: "devvit-featured-games",
  GQLHost: "devvit-gql-host",
  Installation: "devvit-installation",
  ModPermissions: "devvit-mod-permissions",
  Post: "devvit-post",
  PostAuthor: "devvit-post-author",
  PostData: "devvit-post-data",
  RemoteHostname: "devvit-remote-hostname",
  StreamID: "devvit-stream-id",
  Subreddit: "devvit-subreddit",
  SubredditName: "devvit-subreddit-name",
  User: "devvit-user",
  Username: "devvit-user-name",
  UserSnoovatarUrl: "devvit-user-snoovatar-url",
  UserAgent: "devvit-user-agent",
  Version: "devvit-version",
  Language: "devvit-accept-language",
  Timezone: "devvit-accept-timezone",
  Traceparent: "traceparent",
  Tracestate: "tracestate"
});
var headerPrefix = "devvit-";
var AppDebug;
(function(AppDebug2) {
  AppDebug2["Blocks"] = "blocks";
  AppDebug2["EmitSnapshots"] = "emitSnapshots";
  AppDebug2["EmitState"] = "emitState";
  AppDebug2["Realtime"] = "realtime";
  AppDebug2["Runtime"] = "runtime";
  AppDebug2["Surface"] = "surface";
  AppDebug2["Payments"] = "payments";
  AppDebug2["Bootstrap"] = "bootstrap";
  AppDebug2["WebView"] = "webView";
})(AppDebug || (AppDebug = {}));

// node_modules/@devvit/shared-types/NonNull.js
function assertNonNull(val, msg) {
  if (val == null)
    throw Error(msg ?? "Expected nonnullish value.");
}

// node_modules/jwt-decode/build/esm/index.js
var InvalidTokenError = class extends Error {
};
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }
  let decoded;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
  }
  try {
    return JSON.parse(decoded);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
  }
}

// node_modules/@devvit/public-api/version.json
var version_default = {
  name: "@devvit/public-api",
  version: "0.13.7-dev",
  license: "BSD-3-Clause",
  repository: {
    type: "git",
    url: "https://developers.reddit.com/"
  },
  type: "module",
  exports: {
    ".": "./dist/index.js",
    "./package.json": "./package.json",
    "./*": "./dist/*"
  },
  main: "./dist/index.js",
  files: [
    "dist/**"
  ],
  scripts: {
    build: "tsc && cp -af devvit.tsconfig.json dist/ && yarn build:min",
    "build:min": "esbuild --bundle --sourcemap=linked --target=es2020 --format=esm  --metafile=dist/meta.min.json --outfile=dist/public-api.min.js --external:@devvit/protos --minify src/index.ts",
    clean: "rm -rf .turbo coverage dist src/devvit/internals/semanticColors.ts || :",
    clobber: "yarn clean && rm -rf node_modules",
    "dev:build": "chokidar ./src ../shared-types/dist --command 'yarn build' --ignore './src/devvit/internals/semanticColors.ts'",
    lint: "redlint .",
    "lint:fix": "yarn lint --fix",
    prepublishOnly: "publish-package-json",
    test: "yarn test:unit && yarn test:types && yarn test:size",
    "test:size": "filesize",
    "test:types": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit-with-coverage": "vitest run --coverage"
  },
  types: "./dist/index.d.ts",
  dependencies: {
    "@devvit/metrics": "0.13.7-dev",
    "@devvit/protos": "0.13.7-dev",
    "@devvit/shared": "0.13.7-dev",
    "@devvit/shared-types": "0.13.7-dev",
    "base64-js": "1.5.1",
    "clone-deep": "4.0.1",
    "jwt-decode": "4.0.0",
    moderndash: "4.0.0"
  },
  devDependencies: {
    "@ampproject/filesize": "4.3.0",
    "@devvit/repo-tools": "0.13.7-dev",
    "@devvit/tsconfig": "0.13.7-dev",
    "@reddit/faceplate-ui": "18.2.2",
    "@reddit/rpl-styles": "1.0.2",
    "@types/clone-deep": "4.0.1",
    "@types/node": "20.14.12",
    "chokidar-cli": "3.0.0",
    esbuild: "0.25.9",
    eslint: "9.11.1",
    typescript: "5.8.3",
    vitest: "4.1.0"
  },
  publishConfig: {
    directory: "dist"
  },
  filesize: {
    "dist/public-api.min.js": {
      gzip: "67 KB",
      none: "236 KB"
    }
  },
  source: "./src/index.ts"
};

// node_modules/@devvit/public-api/devvit/internals/context.js
function getContextFromMetadata(metadata, postId, commentId) {
  const subredditId = metadata[Header.Subreddit]?.values[0];
  assertNonNull(subredditId, "subreddit is missing from Context");
  const subredditName = metadata[Header.SubredditName]?.values[0];
  let postData;
  const postDataJSON = metadata[Header.PostData]?.values[0];
  if (postDataJSON) {
    postData = JSON.parse(postDataJSON).developerData;
  }
  const appAccountId = metadata[Header.AppUser]?.values[0];
  const appSlug = metadata[Header.App]?.values[0];
  const appVersion = metadata[Header.Version]?.values[0];
  const snoovatar = metadata[Header.UserSnoovatarUrl]?.values[0];
  const username = metadata[Header.Username]?.values[0];
  const userId = metadata[Header.User]?.values[0];
  const debug = parseDebug(metadata);
  let loid;
  try {
    const signedRequestContext = decodeSignedRequestContext(metadata[Header.Context]?.values[0]);
    loid = signedRequestContext?.user?.devvitLoid ?? signedRequestContext?.user?.devvit_loid;
  } catch {
    loid = void 0;
  }
  return {
    get appAccountId() {
      assertNonNull(appAccountId, "appAccountId is missing from Context");
      return appAccountId;
    },
    subredditId,
    subredditName,
    userId,
    postId,
    postData,
    commentId,
    appName: appSlug,
    appSlug,
    appVersion,
    snoovatar,
    username,
    loid,
    debug,
    metadata,
    toJSON() {
      return {
        appAccountId,
        appName: appSlug,
        appSlug,
        appVersion,
        subredditId,
        subredditName,
        userId,
        postId,
        postData,
        commentId,
        snoovatar,
        username,
        loid,
        debug,
        metadata
      };
    }
  };
}
function parseDebug(meta) {
  var _a;
  const keyset = {
    blocks: void 0,
    emitSnapshots: void 0,
    emitState: void 0,
    realtime: void 0,
    // Deprecated in public-api; use @devvit/web instead
    runtime: void 0,
    surface: void 0,
    payments: void 0,
    // Deprecated in public-api; use @devvit/payments instead
    bootstrap: void 0,
    webView: void 0
  };
  const lowerKeyToKey = {};
  for (const key in keyset)
    lowerKeyToKey[key.toLowerCase()] = key;
  const debug = {};
  for (const kv of (meta[Header.Debug]?.values ?? []).join().split(",")) {
    let [k, v] = kv.split("=");
    if (!k)
      continue;
    k = k.trim();
    v = v?.trim();
    if (k.toLowerCase() in lowerKeyToKey)
      k = lowerKeyToKey[k.toLowerCase()];
    debug[_a = k] ?? (debug[_a] = v || `${true}`);
  }
  if (meta[Header.Debug])
    console.info(`[api] @devvit/public-api v${version_default.version} ${Object.entries(debug).map(([k, v]) => `${k}=${v}`).join(" ")}`);
  return { ...debug };
}
function decodeSignedRequestContext(token) {
  if (!token)
    return;
  try {
    return jwtDecode(token)?.devvit;
  } catch (err) {
    throw Error("token decode failure", { cause: err });
  }
}

// node_modules/@devvit/protos/json/devvit/events/v1alpha/events.js
var EventSource;
(function(EventSource2) {
  EventSource2[EventSource2["UNKNOWN_EVENT_SOURCE"] = 0] = "UNKNOWN_EVENT_SOURCE";
  EventSource2[EventSource2["USER"] = 1] = "USER";
  EventSource2[EventSource2["ADMIN"] = 2] = "ADMIN";
  EventSource2[EventSource2["MODERATOR"] = 3] = "MODERATOR";
  EventSource2[EventSource2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(EventSource || (EventSource = {}));
var DeletionReason;
(function(DeletionReason2) {
  DeletionReason2[DeletionReason2["UNSPECIFIED_DELETION_REASON"] = 0] = "UNSPECIFIED_DELETION_REASON";
  DeletionReason2[DeletionReason2["SPAM"] = 1] = "SPAM";
  DeletionReason2[DeletionReason2["LEGAL"] = 2] = "LEGAL";
  DeletionReason2[DeletionReason2["OTHER"] = 3] = "OTHER";
  DeletionReason2[DeletionReason2["UNKNOWN"] = 4] = "UNKNOWN";
  DeletionReason2[DeletionReason2["EXPLICIT_CONTENT"] = 5] = "EXPLICIT_CONTENT";
  DeletionReason2[DeletionReason2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DeletionReason || (DeletionReason = {}));

// node_modules/@devvit/protos/json/devvit/reddit/v2alpha/postv2.js
var CrowdControlLevel;
(function(CrowdControlLevel2) {
  CrowdControlLevel2[CrowdControlLevel2["OFF"] = 0] = "OFF";
  CrowdControlLevel2[CrowdControlLevel2["LENIENT"] = 1] = "LENIENT";
  CrowdControlLevel2[CrowdControlLevel2["MEDIUM"] = 2] = "MEDIUM";
  CrowdControlLevel2[CrowdControlLevel2["STRICT"] = 3] = "STRICT";
  CrowdControlLevel2[CrowdControlLevel2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(CrowdControlLevel || (CrowdControlLevel = {}));
var DistinguishType;
(function(DistinguishType2) {
  DistinguishType2[DistinguishType2["NULL_VALUE"] = 0] = "NULL_VALUE";
  DistinguishType2[DistinguishType2["ADMIN"] = 1] = "ADMIN";
  DistinguishType2[DistinguishType2["GOLD"] = 2] = "GOLD";
  DistinguishType2[DistinguishType2["GOLD_AUTO"] = 3] = "GOLD_AUTO";
  DistinguishType2[DistinguishType2["YES"] = 4] = "YES";
  DistinguishType2[DistinguishType2["SPECIAL"] = 5] = "SPECIAL";
  DistinguishType2[DistinguishType2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(DistinguishType || (DistinguishType = {}));

// node_modules/@devvit/protos/json/devvit/reddit/v2alpha/subredditv2.js
var SubredditType;
(function(SubredditType2) {
  SubredditType2[SubredditType2["ARCHIVED"] = 0] = "ARCHIVED";
  SubredditType2[SubredditType2["EMPLOYEES_ONLY"] = 1] = "EMPLOYEES_ONLY";
  SubredditType2[SubredditType2["GOLD_ONLY"] = 2] = "GOLD_ONLY";
  SubredditType2[SubredditType2["GOLD_RESTRICTED"] = 3] = "GOLD_RESTRICTED";
  SubredditType2[SubredditType2["PRIVATE"] = 4] = "PRIVATE";
  SubredditType2[SubredditType2["PUBLIC"] = 5] = "PUBLIC";
  SubredditType2[SubredditType2["RESTRICTED"] = 6] = "RESTRICTED";
  SubredditType2[SubredditType2["USER"] = 7] = "USER";
  SubredditType2[SubredditType2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SubredditType || (SubredditType = {}));
var SubredditRating;
(function(SubredditRating2) {
  SubredditRating2[SubredditRating2["UNKNOWN_SUBREDDIT_RATING"] = 0] = "UNKNOWN_SUBREDDIT_RATING";
  SubredditRating2[SubredditRating2["E"] = 1] = "E";
  SubredditRating2[SubredditRating2["M1"] = 2] = "M1";
  SubredditRating2[SubredditRating2["M2"] = 3] = "M2";
  SubredditRating2[SubredditRating2["D"] = 4] = "D";
  SubredditRating2[SubredditRating2["V"] = 5] = "V";
  SubredditRating2[SubredditRating2["X"] = 6] = "X";
  SubredditRating2[SubredditRating2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SubredditRating || (SubredditRating = {}));
var SubredditTypeV2;
(function(SubredditTypeV22) {
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_UNSPECIFIED"] = 0] = "SUBREDDIT_TYPE_UNSPECIFIED";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_UNKNOWN"] = 1] = "SUBREDDIT_TYPE_UNKNOWN";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_ARCHIVED"] = 2] = "SUBREDDIT_TYPE_ARCHIVED";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_EMPLOYEES_ONLY"] = 3] = "SUBREDDIT_TYPE_EMPLOYEES_ONLY";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_GOLD_ONLY"] = 4] = "SUBREDDIT_TYPE_GOLD_ONLY";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_GOLD_RESTRICTED"] = 5] = "SUBREDDIT_TYPE_GOLD_RESTRICTED";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_PRIVATE"] = 6] = "SUBREDDIT_TYPE_PRIVATE";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_PUBLIC"] = 7] = "SUBREDDIT_TYPE_PUBLIC";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_RESTRICTED"] = 8] = "SUBREDDIT_TYPE_RESTRICTED";
  SubredditTypeV22[SubredditTypeV22["SUBREDDIT_TYPE_USER"] = 9] = "SUBREDDIT_TYPE_USER";
  SubredditTypeV22[SubredditTypeV22["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SubredditTypeV2 || (SubredditTypeV2 = {}));
var SubredditRatingV2;
(function(SubredditRatingV22) {
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_UNSPECIFIED"] = 0] = "SUBREDDIT_RATING_UNSPECIFIED";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_UNKNOWN"] = 1] = "SUBREDDIT_RATING_UNKNOWN";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_E"] = 2] = "SUBREDDIT_RATING_E";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_M1"] = 3] = "SUBREDDIT_RATING_M1";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_M2"] = 4] = "SUBREDDIT_RATING_M2";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_D"] = 5] = "SUBREDDIT_RATING_D";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_V"] = 6] = "SUBREDDIT_RATING_V";
  SubredditRatingV22[SubredditRatingV22["SUBREDDIT_RATING_X"] = 7] = "SUBREDDIT_RATING_X";
  SubredditRatingV22[SubredditRatingV22["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SubredditRatingV2 || (SubredditRatingV2 = {}));

// node_modules/@devvit/shared-types/shared/form.js
var SettingScope;
(function(SettingScope2) {
  SettingScope2["Installation"] = "installation";
  SettingScope2["App"] = "app";
})(SettingScope || (SettingScope = {}));

// node_modules/@devvit/shared-types/assert.js
function assert(condition, msg) {
  if (!condition)
    throw Error(msg);
}

// node_modules/@devvit/shared-types/tid.js
var T_PREFIX;
(function(T_PREFIX2) {
  T_PREFIX2["COMMENT"] = "t1_";
  T_PREFIX2["ACCOUNT"] = "t2_";
  T_PREFIX2["LINK"] = "t3_";
  T_PREFIX2["MESSAGE"] = "t4_";
  T_PREFIX2["SUBREDDIT"] = "t5_";
  T_PREFIX2["AWARD"] = "t6_";
})(T_PREFIX || (T_PREFIX = {}));
function isT1(id) {
  return !!id?.startsWith(T_PREFIX.COMMENT);
}
function isT2(id) {
  return !!id?.startsWith(T_PREFIX.ACCOUNT);
}
function isT3(id) {
  return !!id?.startsWith(T_PREFIX.LINK);
}
function isT5(id) {
  return !!id?.startsWith(T_PREFIX.SUBREDDIT);
}
function assertT1(id) {
  assert(isT1(id), `Expected comment id to start with ${T_PREFIX.COMMENT}, got ${id}`);
}
function assertT2(id) {
  assert(isT2(id), `Expected account id to start with ${T_PREFIX.ACCOUNT}, got ${id}`);
}
function assertT3(id) {
  assert(isT3(id), `Expected link id to start with ${T_PREFIX.LINK}, got ${id}`);
}
function assertT5(id) {
  assert(isT5(id), `Expected subreddit id to start with ${T_PREFIX.SUBREDDIT}, got ${id}`);
}
function T1(id) {
  assertT1(id);
  return id;
}
function T2(id) {
  assertT2(id);
  return id;
}
function T3(id) {
  assertT3(id);
  return id;
}
function T5(id) {
  assertT5(id);
  return id;
}

// node_modules/@devvit/server/server-context.js
var nonDevvitMetadataHeaders = /* @__PURE__ */ new Set([Header.Traceparent, Header.Tracestate]);
var Context = (headers) => {
  const meta = metaFromIncomingMessage(headers);
  const publicApiContext = getContextFromMetadata(meta, meta[Header.Post]?.values[0], meta[Header.Comment]?.values[0]);
  return {
    ...publicApiContext,
    commentId: publicApiContext.commentId ? T1(publicApiContext.commentId) : void 0,
    subredditId: T5(publicApiContext.subredditId),
    userId: publicApiContext.userId ? T2(publicApiContext.userId) : void 0,
    postId: publicApiContext.postId ? T3(publicApiContext.postId) : void 0,
    subredditName: publicApiContext.subredditName,
    // This is guaranteed to be defined
    snoovatar: publicApiContext.snoovatar,
    username: publicApiContext.username,
    loid: publicApiContext.loid
  };
};
function metaFromIncomingMessage(headers) {
  const meta = {};
  for (const [key, val] of Object.entries(headers))
    if (key.startsWith(headerPrefix) || nonDevvitMetadataHeaders.has(key))
      meta[key] = { values: typeof val === "object" ? val : val == null ? [] : [val] };
  return meta;
}

// node_modules/@devvit/server/create-server.js
var createServer = (optionsOrRequestListener, requestListener) => {
  if (typeof optionsOrRequestListener === "function") {
    return _createServer({}, optionsOrRequestListener);
  }
  return _createServer(optionsOrRequestListener ?? {}, requestListener);
};
function _createServer(options, requestListener) {
  globalThis.devvit ?? (globalThis.devvit = {});
  globalThis.devvit.metadataProvider = getMetadata;
  const server2 = (0, import_node_http.createServer)(options, async (req, res) => {
    const context2 = Context(req.headers);
    return runWithContext(context2, async () => {
      return requestListener?.(req, res);
    });
  });
  const originalListen = server2.listen.bind(server2);
  server2.listen = (...args) => {
    if (globalThis.enableWebbitBundlingHack) {
      return server2;
    }
    return originalListen(...args);
  };
  return server2;
}

// node_modules/@devvit/shared-types/server/get-server-port.js
var import_node_process = __toESM(require("node:process"), 1);
function getServerPort() {
  const envPort = Number(import_node_process.default.env.WEBBIT_PORT);
  if (isNaN(envPort)) {
    return 3e3;
  }
  return envPort;
}

// node_modules/@devvit/protos/json/devvit/plugin/redis/redisapi.js
var RedisKeyScope;
(function(RedisKeyScope3) {
  RedisKeyScope3[RedisKeyScope3["INSTALLATION"] = 0] = "INSTALLATION";
  RedisKeyScope3[RedisKeyScope3["GLOBAL"] = 1] = "GLOBAL";
  RedisKeyScope3[RedisKeyScope3["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(RedisKeyScope || (RedisKeyScope = {}));
var BitfieldOverflowBehavior;
(function(BitfieldOverflowBehavior3) {
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED"] = 0] = "BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_WRAP"] = 1] = "BITFIELD_OVERFLOW_BEHAVIOR_WRAP";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_SAT"] = 2] = "BITFIELD_OVERFLOW_BEHAVIOR_SAT";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_FAIL"] = 3] = "BITFIELD_OVERFLOW_BEHAVIOR_FAIL";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(BitfieldOverflowBehavior || (BitfieldOverflowBehavior = {}));

// node_modules/long/index.js
var wasm = null;
try {
  wasm = new WebAssembly.Instance(
    new WebAssembly.Module(
      new Uint8Array([
        // \0asm
        0,
        97,
        115,
        109,
        // version 1
        1,
        0,
        0,
        0,
        // section "type"
        1,
        13,
        2,
        // 0, () => i32
        96,
        0,
        1,
        127,
        // 1, (i32, i32, i32, i32) => i32
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        // section "function"
        3,
        7,
        6,
        // 0, type 0
        0,
        // 1, type 1
        1,
        // 2, type 1
        1,
        // 3, type 1
        1,
        // 4, type 1
        1,
        // 5, type 1
        1,
        // section "global"
        6,
        6,
        1,
        // 0, "high", mutable i32
        127,
        1,
        65,
        0,
        11,
        // section "export"
        7,
        50,
        6,
        // 0, "mul"
        3,
        109,
        117,
        108,
        0,
        1,
        // 1, "div_s"
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        // 2, "div_u"
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        // 3, "rem_s"
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        // 4, "rem_u"
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        // 5, "get_high"
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        // section "code"
        10,
        191,
        1,
        6,
        // 0, "get_high"
        4,
        0,
        35,
        0,
        11,
        // 1, "mul"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 2, "div_s"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 3, "div_u"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 4, "rem_s"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 5, "rem_u"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])
    ),
    {}
  ).exports;
} catch {
}
function Long(low, high, unsigned) {
  this.low = low | 0;
  this.high = high | 0;
  this.unsigned = !!unsigned;
}
Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });
function isLong(obj) {
  return (obj && obj["__isLong__"]) === true;
}
function ctz32(value) {
  var c = Math.clz32(value & -value);
  return value ? 31 - c : c;
}
Long.isLong = isLong;
var INT_CACHE = {};
var UINT_CACHE = {};
function fromInt(value, unsigned) {
  var obj, cachedObj, cache;
  if (unsigned) {
    value >>>= 0;
    if (cache = 0 <= value && value < 256) {
      cachedObj = UINT_CACHE[value];
      if (cachedObj) return cachedObj;
    }
    obj = fromBits(value, 0, true);
    if (cache) UINT_CACHE[value] = obj;
    return obj;
  } else {
    value |= 0;
    if (cache = -128 <= value && value < 128) {
      cachedObj = INT_CACHE[value];
      if (cachedObj) return cachedObj;
    }
    obj = fromBits(value, value < 0 ? -1 : 0, false);
    if (cache) INT_CACHE[value] = obj;
    return obj;
  }
}
Long.fromInt = fromInt;
function fromNumber(value, unsigned) {
  if (isNaN(value)) return unsigned ? UZERO : ZERO;
  if (unsigned) {
    if (value < 0) return UZERO;
    if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
  } else {
    if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
    if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
  }
  if (value < 0) return fromNumber(-value, unsigned).neg();
  return fromBits(
    value % TWO_PWR_32_DBL | 0,
    value / TWO_PWR_32_DBL | 0,
    unsigned
  );
}
Long.fromNumber = fromNumber;
function fromBits(lowBits, highBits, unsigned) {
  return new Long(lowBits, highBits, unsigned);
}
Long.fromBits = fromBits;
var pow_dbl = Math.pow;
function fromString(str, unsigned, radix) {
  if (str.length === 0) throw Error("empty string");
  if (typeof unsigned === "number") {
    radix = unsigned;
    unsigned = false;
  } else {
    unsigned = !!unsigned;
  }
  if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
    return unsigned ? UZERO : ZERO;
  radix = radix || 10;
  if (radix < 2 || 36 < radix) throw RangeError("radix");
  var p;
  if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
  else if (p === 0) {
    return fromString(str.substring(1), unsigned, radix).neg();
  }
  var radixToPower = fromNumber(pow_dbl(radix, 8));
  var result = ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = fromNumber(pow_dbl(radix, size));
      result = result.mul(power).add(fromNumber(value));
    } else {
      result = result.mul(radixToPower);
      result = result.add(fromNumber(value));
    }
  }
  result.unsigned = unsigned;
  return result;
}
Long.fromString = fromString;
function fromValue(val, unsigned) {
  if (typeof val === "number") return fromNumber(val, unsigned);
  if (typeof val === "string") return fromString(val, unsigned);
  return fromBits(
    val.low,
    val.high,
    typeof unsigned === "boolean" ? unsigned : val.unsigned
  );
}
Long.fromValue = fromValue;
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_24_DBL = 1 << 24;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
var ZERO = fromInt(0);
Long.ZERO = ZERO;
var UZERO = fromInt(0, true);
Long.UZERO = UZERO;
var ONE = fromInt(1);
Long.ONE = ONE;
var UONE = fromInt(1, true);
Long.UONE = UONE;
var NEG_ONE = fromInt(-1);
Long.NEG_ONE = NEG_ONE;
var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
Long.MAX_VALUE = MAX_VALUE;
var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
Long.MIN_VALUE = MIN_VALUE;
var LongPrototype = Long.prototype;
LongPrototype.toInt = function toInt() {
  return this.unsigned ? this.low >>> 0 : this.low;
};
LongPrototype.toNumber = function toNumber() {
  if (this.unsigned)
    return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
  return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};
LongPrototype.toString = function toString(radix) {
  radix = radix || 10;
  if (radix < 2 || 36 < radix) throw RangeError("radix");
  if (this.isZero()) return "0";
  if (this.isNegative()) {
    if (this.eq(MIN_VALUE)) {
      var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
      return div.toString(radix) + rem1.toInt().toString(radix);
    } else return "-" + this.neg().toString(radix);
  }
  var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
  var result = "";
  while (true) {
    var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
    rem = remDiv;
    if (rem.isZero()) return digits + result;
    else {
      while (digits.length < 6) digits = "0" + digits;
      result = "" + digits + result;
    }
  }
};
LongPrototype.getHighBits = function getHighBits() {
  return this.high;
};
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
  return this.high >>> 0;
};
LongPrototype.getLowBits = function getLowBits() {
  return this.low;
};
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
  return this.low >>> 0;
};
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
  if (this.isNegative())
    return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
  var val = this.high != 0 ? this.high : this.low;
  for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
  return this.high != 0 ? bit + 33 : bit + 1;
};
LongPrototype.isSafeInteger = function isSafeInteger() {
  var top11Bits = this.high >> 21;
  if (!top11Bits) return true;
  if (this.unsigned) return false;
  return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
};
LongPrototype.isZero = function isZero() {
  return this.high === 0 && this.low === 0;
};
LongPrototype.eqz = LongPrototype.isZero;
LongPrototype.isNegative = function isNegative() {
  return !this.unsigned && this.high < 0;
};
LongPrototype.isPositive = function isPositive() {
  return this.unsigned || this.high >= 0;
};
LongPrototype.isOdd = function isOdd() {
  return (this.low & 1) === 1;
};
LongPrototype.isEven = function isEven() {
  return (this.low & 1) === 0;
};
LongPrototype.equals = function equals(other) {
  if (!isLong(other)) other = fromValue(other);
  if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
    return false;
  return this.high === other.high && this.low === other.low;
};
LongPrototype.eq = LongPrototype.equals;
LongPrototype.notEquals = function notEquals(other) {
  return !this.eq(
    /* validates */
    other
  );
};
LongPrototype.neq = LongPrototype.notEquals;
LongPrototype.ne = LongPrototype.notEquals;
LongPrototype.lessThan = function lessThan(other) {
  return this.comp(
    /* validates */
    other
  ) < 0;
};
LongPrototype.lt = LongPrototype.lessThan;
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
  return this.comp(
    /* validates */
    other
  ) <= 0;
};
LongPrototype.lte = LongPrototype.lessThanOrEqual;
LongPrototype.le = LongPrototype.lessThanOrEqual;
LongPrototype.greaterThan = function greaterThan(other) {
  return this.comp(
    /* validates */
    other
  ) > 0;
};
LongPrototype.gt = LongPrototype.greaterThan;
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
  return this.comp(
    /* validates */
    other
  ) >= 0;
};
LongPrototype.gte = LongPrototype.greaterThanOrEqual;
LongPrototype.ge = LongPrototype.greaterThanOrEqual;
LongPrototype.compare = function compare(other) {
  if (!isLong(other)) other = fromValue(other);
  if (this.eq(other)) return 0;
  var thisNeg = this.isNegative(), otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) return -1;
  if (!thisNeg && otherNeg) return 1;
  if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
  return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
};
LongPrototype.comp = LongPrototype.compare;
LongPrototype.negate = function negate() {
  if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
  return this.not().add(ONE);
};
LongPrototype.neg = LongPrototype.negate;
LongPrototype.add = function add(addend) {
  if (!isLong(addend)) addend = fromValue(addend);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = addend.high >>> 16;
  var b32 = addend.high & 65535;
  var b16 = addend.low >>> 16;
  var b00 = addend.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 + b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.subtract = function subtract(subtrahend) {
  if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
  return this.add(subtrahend.neg());
};
LongPrototype.sub = LongPrototype.subtract;
LongPrototype.multiply = function multiply(multiplier) {
  if (this.isZero()) return this;
  if (!isLong(multiplier)) multiplier = fromValue(multiplier);
  if (wasm) {
    var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
  if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
  if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
  if (this.isNegative()) {
    if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
    else return this.neg().mul(multiplier).neg();
  } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
  if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
    return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = multiplier.high >>> 16;
  var b32 = multiplier.high & 65535;
  var b16 = multiplier.low >>> 16;
  var b00 = multiplier.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.mul = LongPrototype.multiply;
LongPrototype.divide = function divide(divisor) {
  if (!isLong(divisor)) divisor = fromValue(divisor);
  if (divisor.isZero()) throw Error("division by zero");
  if (wasm) {
    if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
      return this;
    }
    var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (this.isZero()) return this.unsigned ? UZERO : ZERO;
  var approx, rem, res;
  if (!this.unsigned) {
    if (this.eq(MIN_VALUE)) {
      if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
        return MIN_VALUE;
      else if (divisor.eq(MIN_VALUE)) return ONE;
      else {
        var halfThis = this.shr(1);
        approx = halfThis.div(divisor).shl(1);
        if (approx.eq(ZERO)) {
          return divisor.isNegative() ? ONE : NEG_ONE;
        } else {
          rem = this.sub(divisor.mul(approx));
          res = approx.add(rem.div(divisor));
          return res;
        }
      }
    } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
    if (this.isNegative()) {
      if (divisor.isNegative()) return this.neg().div(divisor.neg());
      return this.neg().div(divisor).neg();
    } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
    res = ZERO;
  } else {
    if (!divisor.unsigned) divisor = divisor.toUnsigned();
    if (divisor.gt(this)) return UZERO;
    if (divisor.gt(this.shru(1)))
      return UONE;
    res = UZERO;
  }
  rem = this;
  while (rem.gte(divisor)) {
    approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
    var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
    while (approxRem.isNegative() || approxRem.gt(rem)) {
      approx -= delta;
      approxRes = fromNumber(approx, this.unsigned);
      approxRem = approxRes.mul(divisor);
    }
    if (approxRes.isZero()) approxRes = ONE;
    res = res.add(approxRes);
    rem = rem.sub(approxRem);
  }
  return res;
};
LongPrototype.div = LongPrototype.divide;
LongPrototype.modulo = function modulo(divisor) {
  if (!isLong(divisor)) divisor = fromValue(divisor);
  if (wasm) {
    var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  return this.sub(this.div(divisor).mul(divisor));
};
LongPrototype.mod = LongPrototype.modulo;
LongPrototype.rem = LongPrototype.modulo;
LongPrototype.not = function not() {
  return fromBits(~this.low, ~this.high, this.unsigned);
};
LongPrototype.countLeadingZeros = function countLeadingZeros() {
  return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
};
LongPrototype.clz = LongPrototype.countLeadingZeros;
LongPrototype.countTrailingZeros = function countTrailingZeros() {
  return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
};
LongPrototype.ctz = LongPrototype.countTrailingZeros;
LongPrototype.and = function and(other) {
  if (!isLong(other)) other = fromValue(other);
  return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};
LongPrototype.or = function or(other) {
  if (!isLong(other)) other = fromValue(other);
  return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};
LongPrototype.xor = function xor(other) {
  if (!isLong(other)) other = fromValue(other);
  return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};
LongPrototype.shiftLeft = function shiftLeft(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) === 0) return this;
  else if (numBits < 32)
    return fromBits(
      this.low << numBits,
      this.high << numBits | this.low >>> 32 - numBits,
      this.unsigned
    );
  else return fromBits(0, this.low << numBits - 32, this.unsigned);
};
LongPrototype.shl = LongPrototype.shiftLeft;
LongPrototype.shiftRight = function shiftRight(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) === 0) return this;
  else if (numBits < 32)
    return fromBits(
      this.low >>> numBits | this.high << 32 - numBits,
      this.high >> numBits,
      this.unsigned
    );
  else
    return fromBits(
      this.high >> numBits - 32,
      this.high >= 0 ? 0 : -1,
      this.unsigned
    );
};
LongPrototype.shr = LongPrototype.shiftRight;
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) === 0) return this;
  if (numBits < 32)
    return fromBits(
      this.low >>> numBits | this.high << 32 - numBits,
      this.high >>> numBits,
      this.unsigned
    );
  if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
  return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
};
LongPrototype.shru = LongPrototype.shiftRightUnsigned;
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
LongPrototype.rotateLeft = function rotateLeft(numBits) {
  var b;
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) === 0) return this;
  if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(
      this.low << numBits | this.high >>> b,
      this.high << numBits | this.low >>> b,
      this.unsigned
    );
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(
    this.high << numBits | this.low >>> b,
    this.low << numBits | this.high >>> b,
    this.unsigned
  );
};
LongPrototype.rotl = LongPrototype.rotateLeft;
LongPrototype.rotateRight = function rotateRight(numBits) {
  var b;
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) === 0) return this;
  if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(
      this.high << b | this.low >>> numBits,
      this.low << b | this.high >>> numBits,
      this.unsigned
    );
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(
    this.low << b | this.high >>> numBits,
    this.high << b | this.low >>> numBits,
    this.unsigned
  );
};
LongPrototype.rotr = LongPrototype.rotateRight;
LongPrototype.toSigned = function toSigned() {
  if (!this.unsigned) return this;
  return fromBits(this.low, this.high, false);
};
LongPrototype.toUnsigned = function toUnsigned() {
  if (this.unsigned) return this;
  return fromBits(this.low, this.high, true);
};
LongPrototype.toBytes = function toBytes(le) {
  return le ? this.toBytesLE() : this.toBytesBE();
};
LongPrototype.toBytesLE = function toBytesLE() {
  var hi = this.high, lo = this.low;
  return [
    lo & 255,
    lo >>> 8 & 255,
    lo >>> 16 & 255,
    lo >>> 24,
    hi & 255,
    hi >>> 8 & 255,
    hi >>> 16 & 255,
    hi >>> 24
  ];
};
LongPrototype.toBytesBE = function toBytesBE() {
  var hi = this.high, lo = this.low;
  return [
    hi >>> 24,
    hi >>> 16 & 255,
    hi >>> 8 & 255,
    hi & 255,
    lo >>> 24,
    lo >>> 16 & 255,
    lo >>> 8 & 255,
    lo & 255
  ];
};
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
  return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
  return new Long(
    bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
    bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
    unsigned
  );
};
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
  return new Long(
    bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
    bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
    unsigned
  );
};
if (typeof BigInt === "function") {
  Long.fromBigInt = function fromBigInt(value, unsigned) {
    var lowBits = Number(BigInt.asIntN(32, value));
    var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
    return fromBits(lowBits, highBits, unsigned);
  };
  Long.fromValue = function fromValueWithBigInt(value, unsigned) {
    if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
    return fromValue(value, unsigned);
  };
  LongPrototype.toBigInt = function toBigInt() {
    var lowBigInt = BigInt(this.low >>> 0);
    var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
    return highBigInt << BigInt(32) | lowBigInt;
  };
}
var long_default = Long;

// node_modules/@devvit/protos/types/devvit/plugin/redis/redisapi.js
var import_minimal3 = __toESM(require_minimal2(), 1);

// node_modules/@devvit/protos/types/google/protobuf/empty.js
var import_minimal = __toESM(require_minimal2(), 1);

// node_modules/@devvit/protos/types/typeRegistry.js
var messageTypeRegistry = /* @__PURE__ */ new Map();

// node_modules/@devvit/protos/types/google/protobuf/empty.js
function createBaseEmpty() {
  return {};
}
var Empty = {
  $type: "google.protobuf.Empty",
  encode(_, writer = import_minimal.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : import_minimal.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(_) {
    return {};
  },
  toJSON(_) {
    const obj = {};
    return obj;
  },
  create(base) {
    return Empty.fromPartial(base ?? {});
  },
  fromPartial(_) {
    const message = createBaseEmpty();
    return message;
  }
};
messageTypeRegistry.set(Empty.$type, Empty);

// node_modules/@devvit/protos/types/google/protobuf/wrappers.js
var import_minimal2 = __toESM(require_minimal2(), 1);
function createBaseDoubleValue() {
  return { value: 0 };
}
var DoubleValue = {
  $type: "google.protobuf.DoubleValue",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(9).double(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseDoubleValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }
          message.value = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return DoubleValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseDoubleValue();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(DoubleValue.$type, DoubleValue);
function createBaseFloatValue() {
  return { value: 0 };
}
var FloatValue = {
  $type: "google.protobuf.FloatValue",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(13).float(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFloatValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.value = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return FloatValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFloatValue();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(FloatValue.$type, FloatValue);
function createBaseInt64Value() {
  return { value: 0 };
}
var Int64Value = {
  $type: "google.protobuf.Int64Value",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(8).int64(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseInt64Value();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = longToNumber(reader.int64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
  create(base) {
    return Int64Value.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseInt64Value();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(Int64Value.$type, Int64Value);
function createBaseUInt64Value() {
  return { value: 0 };
}
var UInt64Value = {
  $type: "google.protobuf.UInt64Value",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(8).uint64(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseUInt64Value();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = longToNumber(reader.uint64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
  create(base) {
    return UInt64Value.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseUInt64Value();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(UInt64Value.$type, UInt64Value);
function createBaseInt32Value() {
  return { value: 0 };
}
var Int32Value = {
  $type: "google.protobuf.Int32Value",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(8).int32(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseInt32Value();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
  create(base) {
    return Int32Value.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseInt32Value();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(Int32Value.$type, Int32Value);
function createBaseUInt32Value() {
  return { value: 0 };
}
var UInt32Value = {
  $type: "google.protobuf.UInt32Value",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(8).uint32(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseUInt32Value();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Number(object.value) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
  create(base) {
    return UInt32Value.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseUInt32Value();
    message.value = object.value ?? 0;
    return message;
  }
};
messageTypeRegistry.set(UInt32Value.$type, UInt32Value);
function createBaseBoolValue() {
  return { value: false };
}
var BoolValue = {
  $type: "google.protobuf.BoolValue",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== false) {
      writer.uint32(8).bool(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBoolValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.Boolean(object.value) : false };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== false) {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return BoolValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBoolValue();
    message.value = object.value ?? false;
    return message;
  }
};
messageTypeRegistry.set(BoolValue.$type, BoolValue);
function createBaseStringValue() {
  return { value: "" };
}
var StringValue = {
  $type: "google.protobuf.StringValue",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseStringValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? globalThis.String(object.value) : "" };
  },
  toJSON(message) {
    const obj = {};
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return StringValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseStringValue();
    message.value = object.value ?? "";
    return message;
  }
};
messageTypeRegistry.set(StringValue.$type, StringValue);
function createBaseBytesValue() {
  return { value: new Uint8Array(0) };
}
var BytesValue = {
  $type: "google.protobuf.BytesValue",
  encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBytesValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.value = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array(0) };
  },
  toJSON(message) {
    const obj = {};
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },
  create(base) {
    return BytesValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBytesValue();
    message.value = object.value ?? new Uint8Array(0);
    return message;
  }
};
messageTypeRegistry.set(BytesValue.$type, BytesValue);
function bytesFromBase64(b64) {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}
function base64FromBytes(arr) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}
function longToNumber(long) {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}
if (import_minimal2.default.util.Long !== long_default) {
  import_minimal2.default.util.Long = long_default;
  import_minimal2.default.configure();
}
function isSet(value) {
  return value !== null && value !== void 0;
}

// node_modules/@devvit/protos/types/devvit/plugin/redis/redisapi.js
var RedisKeyScope2;
(function(RedisKeyScope3) {
  RedisKeyScope3[RedisKeyScope3["INSTALLATION"] = 0] = "INSTALLATION";
  RedisKeyScope3[RedisKeyScope3["GLOBAL"] = 1] = "GLOBAL";
  RedisKeyScope3[RedisKeyScope3["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(RedisKeyScope2 || (RedisKeyScope2 = {}));
function redisKeyScopeFromJSON(object) {
  switch (object) {
    case 0:
    case "INSTALLATION":
      return RedisKeyScope2.INSTALLATION;
    case 1:
    case "GLOBAL":
      return RedisKeyScope2.GLOBAL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RedisKeyScope2.UNRECOGNIZED;
  }
}
function redisKeyScopeToJSON(object) {
  switch (object) {
    case RedisKeyScope2.INSTALLATION:
      return 0;
    case RedisKeyScope2.GLOBAL:
      return 1;
    case RedisKeyScope2.UNRECOGNIZED:
    default:
      return -1;
  }
}
var BitfieldOverflowBehavior2;
(function(BitfieldOverflowBehavior3) {
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED"] = 0] = "BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_WRAP"] = 1] = "BITFIELD_OVERFLOW_BEHAVIOR_WRAP";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_SAT"] = 2] = "BITFIELD_OVERFLOW_BEHAVIOR_SAT";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["BITFIELD_OVERFLOW_BEHAVIOR_FAIL"] = 3] = "BITFIELD_OVERFLOW_BEHAVIOR_FAIL";
  BitfieldOverflowBehavior3[BitfieldOverflowBehavior3["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(BitfieldOverflowBehavior2 || (BitfieldOverflowBehavior2 = {}));
function bitfieldOverflowBehaviorFromJSON(object) {
  switch (object) {
    case 0:
    case "BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED":
      return BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED;
    case 1:
    case "BITFIELD_OVERFLOW_BEHAVIOR_WRAP":
      return BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_WRAP;
    case 2:
    case "BITFIELD_OVERFLOW_BEHAVIOR_SAT":
      return BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_SAT;
    case 3:
    case "BITFIELD_OVERFLOW_BEHAVIOR_FAIL":
      return BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_FAIL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return BitfieldOverflowBehavior2.UNRECOGNIZED;
  }
}
function bitfieldOverflowBehaviorToJSON(object) {
  switch (object) {
    case BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_UNSPECIFIED:
      return 0;
    case BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_WRAP:
      return 1;
    case BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_SAT:
      return 2;
    case BitfieldOverflowBehavior2.BITFIELD_OVERFLOW_BEHAVIOR_FAIL:
      return 3;
    case BitfieldOverflowBehavior2.UNRECOGNIZED:
    default:
      return -1;
  }
}
function createBaseTransactionResponses() {
  return { response: [] };
}
var TransactionResponses = {
  $type: "devvit.plugin.redis.TransactionResponses",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.response) {
      TransactionResponse.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseTransactionResponses();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.response.push(TransactionResponse.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      response: globalThis.Array.isArray(object?.response) ? object.response.map((e) => TransactionResponse.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.response?.length) {
      obj.response = message.response.map((e) => TransactionResponse.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return TransactionResponses.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseTransactionResponses();
    message.response = object.response?.map((e) => TransactionResponse.fromPartial(e)) || [];
    return message;
  }
};
messageTypeRegistry.set(TransactionResponses.$type, TransactionResponses);
function createBaseTransactionResponse() {
  return {
    str: void 0,
    nil: void 0,
    num: void 0,
    members: void 0,
    values: void 0,
    dbl: void 0,
    bool: void 0
  };
}
var TransactionResponse = {
  $type: "devvit.plugin.redis.TransactionResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.str !== void 0) {
      StringValue.encode({ value: message.str }, writer.uint32(10).fork()).ldelim();
    }
    if (message.nil !== void 0) {
      Empty.encode(message.nil, writer.uint32(18).fork()).ldelim();
    }
    if (message.num !== void 0) {
      Int64Value.encode({ value: message.num }, writer.uint32(26).fork()).ldelim();
    }
    if (message.members !== void 0) {
      ZMembers.encode(message.members, writer.uint32(34).fork()).ldelim();
    }
    if (message.values !== void 0) {
      RedisValues.encode(message.values, writer.uint32(42).fork()).ldelim();
    }
    if (message.dbl !== void 0) {
      DoubleValue.encode({ value: message.dbl }, writer.uint32(50).fork()).ldelim();
    }
    if (message.bool !== void 0) {
      BoolValue.encode({ value: message.bool }, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.str = StringValue.decode(reader, reader.uint32()).value;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.nil = Empty.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.num = Int64Value.decode(reader, reader.uint32()).value;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.members = ZMembers.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.values = RedisValues.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.dbl = DoubleValue.decode(reader, reader.uint32()).value;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.bool = BoolValue.decode(reader, reader.uint32()).value;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      str: isSet2(object.str) ? String(object.str) : void 0,
      nil: isSet2(object.nil) ? Empty.fromJSON(object.nil) : void 0,
      num: isSet2(object.num) ? Number(object.num) : void 0,
      members: isSet2(object.members) ? ZMembers.fromJSON(object.members) : void 0,
      values: isSet2(object.values) ? RedisValues.fromJSON(object.values) : void 0,
      dbl: isSet2(object.dbl) ? Number(object.dbl) : void 0,
      bool: isSet2(object.bool) ? Boolean(object.bool) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.str !== void 0) {
      obj.str = message.str;
    }
    if (message.nil !== void 0) {
      obj.nil = Empty.toJSON(message.nil);
    }
    if (message.num !== void 0) {
      obj.num = message.num;
    }
    if (message.members !== void 0) {
      obj.members = ZMembers.toJSON(message.members);
    }
    if (message.values !== void 0) {
      obj.values = RedisValues.toJSON(message.values);
    }
    if (message.dbl !== void 0) {
      obj.dbl = message.dbl;
    }
    if (message.bool !== void 0) {
      obj.bool = message.bool;
    }
    return obj;
  },
  create(base) {
    return TransactionResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseTransactionResponse();
    message.str = object.str ?? void 0;
    message.nil = object.nil !== void 0 && object.nil !== null ? Empty.fromPartial(object.nil) : void 0;
    message.num = object.num ?? void 0;
    message.members = object.members !== void 0 && object.members !== null ? ZMembers.fromPartial(object.members) : void 0;
    message.values = object.values !== void 0 && object.values !== null ? RedisValues.fromPartial(object.values) : void 0;
    message.dbl = object.dbl ?? void 0;
    message.bool = object.bool ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(TransactionResponse.$type, TransactionResponse);
function createBaseZRangeRequest() {
  return {
    key: void 0,
    start: "",
    stop: "",
    byScore: false,
    byLex: false,
    rev: false,
    offset: 0,
    count: 0,
    scope: void 0
  };
}
var ZRangeRequest = {
  $type: "devvit.plugin.redis.ZRangeRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.start !== "") {
      writer.uint32(18).string(message.start);
    }
    if (message.stop !== "") {
      writer.uint32(26).string(message.stop);
    }
    if (message.byScore !== false) {
      writer.uint32(32).bool(message.byScore);
    }
    if (message.byLex !== false) {
      writer.uint32(40).bool(message.byLex);
    }
    if (message.rev !== false) {
      writer.uint32(48).bool(message.rev);
    }
    if (message.offset !== 0) {
      writer.uint32(56).int32(message.offset);
    }
    if (message.count !== 0) {
      writer.uint32(64).int32(message.count);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRangeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.start = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.stop = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.byScore = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.byLex = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.rev = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.offset = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }
          message.count = reader.int32();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      start: isSet2(object.start) ? globalThis.String(object.start) : "",
      stop: isSet2(object.stop) ? globalThis.String(object.stop) : "",
      byScore: isSet2(object.byScore) ? globalThis.Boolean(object.byScore) : false,
      byLex: isSet2(object.byLex) ? globalThis.Boolean(object.byLex) : false,
      rev: isSet2(object.rev) ? globalThis.Boolean(object.rev) : false,
      offset: isSet2(object.offset) ? globalThis.Number(object.offset) : 0,
      count: isSet2(object.count) ? globalThis.Number(object.count) : 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.start !== "") {
      obj.start = message.start;
    }
    if (message.stop !== "") {
      obj.stop = message.stop;
    }
    if (message.byScore !== false) {
      obj.byScore = message.byScore;
    }
    if (message.byLex !== false) {
      obj.byLex = message.byLex;
    }
    if (message.rev !== false) {
      obj.rev = message.rev;
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRangeRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRangeRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.start = object.start ?? "";
    message.stop = object.stop ?? "";
    message.byScore = object.byScore ?? false;
    message.byLex = object.byLex ?? false;
    message.rev = object.rev ?? false;
    message.offset = object.offset ?? 0;
    message.count = object.count ?? 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRangeRequest.$type, ZRangeRequest);
function createBaseZRangeByLexRequest() {
  return { key: void 0, min: "", max: "", scope: void 0 };
}
var ZRangeByLexRequest = {
  $type: "devvit.plugin.redis.ZRangeByLexRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.min !== "") {
      writer.uint32(18).string(message.min);
    }
    if (message.max !== "") {
      writer.uint32(26).string(message.max);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRangeByLexRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.min = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.max = reader.string();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      min: isSet2(object.min) ? globalThis.String(object.min) : "",
      max: isSet2(object.max) ? globalThis.String(object.max) : "",
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.min !== "") {
      obj.min = message.min;
    }
    if (message.max !== "") {
      obj.max = message.max;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRangeByLexRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRangeByLexRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.min = object.min ?? "";
    message.max = object.max ?? "";
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRangeByLexRequest.$type, ZRangeByLexRequest);
function createBaseZRangeByScoreRequest() {
  return { key: void 0, min: 0, max: 0, withScores: false, scope: void 0 };
}
var ZRangeByScoreRequest = {
  $type: "devvit.plugin.redis.ZRangeByScoreRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.min !== 0) {
      writer.uint32(17).double(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(25).double(message.max);
    }
    if (message.withScores !== false) {
      writer.uint32(32).bool(message.withScores);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRangeByScoreRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }
          message.min = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }
          message.max = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.withScores = reader.bool();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      min: isSet2(object.min) ? globalThis.Number(object.min) : 0,
      max: isSet2(object.max) ? globalThis.Number(object.max) : 0,
      withScores: isSet2(object.withScores) ? globalThis.Boolean(object.withScores) : false,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.min !== 0) {
      obj.min = message.min;
    }
    if (message.max !== 0) {
      obj.max = message.max;
    }
    if (message.withScores !== false) {
      obj.withScores = message.withScores;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRangeByScoreRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRangeByScoreRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    message.withScores = object.withScores ?? false;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRangeByScoreRequest.$type, ZRangeByScoreRequest);
function createBaseZRemRequest() {
  return { key: void 0, members: [], scope: void 0 };
}
var ZRemRequest = {
  $type: "devvit.plugin.redis.ZRemRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.members) {
      writer.uint32(18).string(v);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.members.push(reader.string());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      members: globalThis.Array.isArray(object?.members) ? object.members.map((e) => globalThis.String(e)) : [],
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.members?.length) {
      obj.members = message.members;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRemRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRemRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.members = object.members?.map((e) => e) || [];
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRemRequest.$type, ZRemRequest);
function createBaseZRemRangeByLexRequest() {
  return { key: void 0, min: "", max: "", scope: void 0 };
}
var ZRemRangeByLexRequest = {
  $type: "devvit.plugin.redis.ZRemRangeByLexRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.min !== "") {
      writer.uint32(18).string(message.min);
    }
    if (message.max !== "") {
      writer.uint32(26).string(message.max);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRemRangeByLexRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.min = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.max = reader.string();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      min: isSet2(object.min) ? globalThis.String(object.min) : "",
      max: isSet2(object.max) ? globalThis.String(object.max) : "",
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.min !== "") {
      obj.min = message.min;
    }
    if (message.max !== "") {
      obj.max = message.max;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRemRangeByLexRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRemRangeByLexRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.min = object.min ?? "";
    message.max = object.max ?? "";
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRemRangeByLexRequest.$type, ZRemRangeByLexRequest);
function createBaseZRemRangeByRankRequest() {
  return { key: void 0, start: 0, stop: 0, scope: void 0 };
}
var ZRemRangeByRankRequest = {
  $type: "devvit.plugin.redis.ZRemRangeByRankRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.start !== 0) {
      writer.uint32(16).int32(message.start);
    }
    if (message.stop !== 0) {
      writer.uint32(24).int32(message.stop);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRemRangeByRankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.start = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.stop = reader.int32();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      start: isSet2(object.start) ? globalThis.Number(object.start) : 0,
      stop: isSet2(object.stop) ? globalThis.Number(object.stop) : 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.stop !== 0) {
      obj.stop = Math.round(message.stop);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRemRangeByRankRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRemRangeByRankRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.start = object.start ?? 0;
    message.stop = object.stop ?? 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRemRangeByRankRequest.$type, ZRemRangeByRankRequest);
function createBaseZRemRangeByScoreRequest() {
  return { key: void 0, min: 0, max: 0, scope: void 0 };
}
var ZRemRangeByScoreRequest = {
  $type: "devvit.plugin.redis.ZRemRangeByScoreRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.min !== 0) {
      writer.uint32(17).double(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(25).double(message.max);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRemRangeByScoreRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }
          message.min = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }
          message.max = reader.double();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      min: isSet2(object.min) ? globalThis.Number(object.min) : 0,
      max: isSet2(object.max) ? globalThis.Number(object.max) : 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.min !== 0) {
      obj.min = message.min;
    }
    if (message.max !== 0) {
      obj.max = message.max;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRemRangeByScoreRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRemRangeByScoreRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRemRangeByScoreRequest.$type, ZRemRangeByScoreRequest);
function createBaseZScoreRequest() {
  return { key: void 0, member: "", scope: void 0 };
}
var ZScoreRequest = {
  $type: "devvit.plugin.redis.ZScoreRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.member !== "") {
      writer.uint32(18).string(message.member);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZScoreRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.member = reader.string();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      member: isSet2(object.member) ? globalThis.String(object.member) : "",
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.member !== "") {
      obj.member = message.member;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZScoreRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZScoreRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.member = object.member ?? "";
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZScoreRequest.$type, ZScoreRequest);
function createBaseZRankRequest() {
  return { key: void 0, member: "", scope: void 0 };
}
var ZRankRequest = {
  $type: "devvit.plugin.redis.ZRankRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== void 0) {
      KeyRequest.encode(message.key, writer.uint32(10).fork()).ldelim();
    }
    if (message.member !== "") {
      writer.uint32(18).string(message.member);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZRankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = KeyRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.member = reader.string();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? KeyRequest.fromJSON(object.key) : void 0,
      member: isSet2(object.member) ? globalThis.String(object.member) : "",
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== void 0) {
      obj.key = KeyRequest.toJSON(message.key);
    }
    if (message.member !== "") {
      obj.member = message.member;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZRankRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZRankRequest();
    message.key = object.key !== void 0 && object.key !== null ? KeyRequest.fromPartial(object.key) : void 0;
    message.member = object.member ?? "";
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZRankRequest.$type, ZRankRequest);
function createBaseRedisRankScore() {
  return { rank: 0, score: 0 };
}
var RedisRankScore = {
  $type: "devvit.plugin.redis.RedisRankScore",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.rank !== 0) {
      writer.uint32(8).int64(message.rank);
    }
    if (message.score !== 0) {
      writer.uint32(17).double(message.score);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisRankScore();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.rank = longToNumber2(reader.int64());
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }
          message.score = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      rank: isSet2(object.rank) ? globalThis.Number(object.rank) : 0,
      score: isSet2(object.score) ? globalThis.Number(object.score) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.rank !== 0) {
      obj.rank = Math.round(message.rank);
    }
    if (message.score !== 0) {
      obj.score = message.score;
    }
    return obj;
  },
  create(base) {
    return RedisRankScore.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisRankScore();
    message.rank = object.rank ?? 0;
    message.score = object.score ?? 0;
    return message;
  }
};
messageTypeRegistry.set(RedisRankScore.$type, RedisRankScore);
function createBaseZIncrByRequest() {
  return { key: "", member: "", value: 0, transactionId: void 0, scope: void 0 };
}
var ZIncrByRequest = {
  $type: "devvit.plugin.redis.ZIncrByRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.member !== "") {
      writer.uint32(18).string(message.member);
    }
    if (message.value !== 0) {
      writer.uint32(25).double(message.value);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(50).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZIncrByRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.member = reader.string();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }
          message.value = reader.double();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      member: isSet2(object.member) ? globalThis.String(object.member) : "",
      value: isSet2(object.value) ? globalThis.Number(object.value) : 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.member !== "") {
      obj.member = message.member;
    }
    if (message.value !== 0) {
      obj.value = message.value;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZIncrByRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZIncrByRequest();
    message.key = object.key ?? "";
    message.member = object.member ?? "";
    message.value = object.value ?? 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZIncrByRequest.$type, ZIncrByRequest);
function createBaseKeyRequest() {
  return { key: "", transactionId: void 0, scope: void 0 };
}
var KeyRequest = {
  $type: "devvit.plugin.redis.KeyRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(18).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return KeyRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseKeyRequest();
    message.key = object.key ?? "";
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(KeyRequest.$type, KeyRequest);
function createBaseIncrByRequest() {
  return { key: "", value: 0, transactionId: void 0, scope: void 0 };
}
var IncrByRequest = {
  $type: "devvit.plugin.redis.IncrByRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int64(message.value);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(50).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseIncrByRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.value = longToNumber2(reader.int64());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      value: isSet2(object.value) ? globalThis.Number(object.value) : 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return IncrByRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseIncrByRequest();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(IncrByRequest.$type, IncrByRequest);
function createBaseSetRequest() {
  return { key: "", value: "", expiration: 0, nx: false, xx: false, transactionId: void 0, scope: void 0 };
}
var SetRequest = {
  $type: "devvit.plugin.redis.SetRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    if (message.expiration !== 0) {
      writer.uint32(24).int64(message.expiration);
    }
    if (message.nx !== false) {
      writer.uint32(32).bool(message.nx);
    }
    if (message.xx !== false) {
      writer.uint32(40).bool(message.xx);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(50).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.expiration = longToNumber2(reader.int64());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.nx = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.xx = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : "",
      expiration: isSet2(object.expiration) ? globalThis.Number(object.expiration) : 0,
      nx: isSet2(object.nx) ? globalThis.Boolean(object.nx) : false,
      xx: isSet2(object.xx) ? globalThis.Boolean(object.xx) : false,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.expiration !== 0) {
      obj.expiration = Math.round(message.expiration);
    }
    if (message.nx !== false) {
      obj.nx = message.nx;
    }
    if (message.xx !== false) {
      obj.xx = message.xx;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return SetRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSetRequest();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    message.expiration = object.expiration ?? 0;
    message.nx = object.nx ?? false;
    message.xx = object.xx ?? false;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(SetRequest.$type, SetRequest);
function createBaseKeyRangeRequest() {
  return { key: "", start: 0, end: 0, transactionId: void 0, scope: void 0 };
}
var KeyRangeRequest = {
  $type: "devvit.plugin.redis.KeyRangeRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.start !== 0) {
      writer.uint32(16).int32(message.start);
    }
    if (message.end !== 0) {
      writer.uint32(24).int32(message.end);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(34).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseKeyRangeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.start = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.end = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      start: isSet2(object.start) ? globalThis.Number(object.start) : 0,
      end: isSet2(object.end) ? globalThis.Number(object.end) : 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return KeyRangeRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseKeyRangeRequest();
    message.key = object.key ?? "";
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(KeyRangeRequest.$type, KeyRangeRequest);
function createBaseSetRangeRequest() {
  return { key: "", offset: 0, value: "", transactionId: void 0, scope: void 0 };
}
var SetRangeRequest = {
  $type: "devvit.plugin.redis.SetRangeRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(34).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSetRangeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.offset = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.value = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      offset: isSet2(object.offset) ? globalThis.Number(object.offset) : 0,
      value: isSet2(object.value) ? globalThis.String(object.value) : "",
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return SetRangeRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSetRangeRequest();
    message.key = object.key ?? "";
    message.offset = object.offset ?? 0;
    message.value = object.value ?? "";
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(SetRangeRequest.$type, SetRangeRequest);
function createBaseKeysRequest() {
  return { keys: [], transactionId: void 0, scope: void 0 };
}
var KeysRequest = {
  $type: "devvit.plugin.redis.KeysRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.keys) {
      writer.uint32(10).string(v);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(18).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseKeysRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.keys.push(reader.string());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      keys: globalThis.Array.isArray(object?.keys) ? object.keys.map((e) => globalThis.String(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.keys?.length) {
      obj.keys = message.keys;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return KeysRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseKeysRequest();
    message.keys = object.keys?.map((e) => e) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(KeysRequest.$type, KeysRequest);
function createBaseKeysResponse() {
  return { keys: [] };
}
var KeysResponse = {
  $type: "devvit.plugin.redis.KeysResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.keys) {
      writer.uint32(10).string(v);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseKeysResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.keys.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { keys: globalThis.Array.isArray(object?.keys) ? object.keys.map((e) => globalThis.String(e)) : [] };
  },
  toJSON(message) {
    const obj = {};
    if (message.keys?.length) {
      obj.keys = message.keys;
    }
    return obj;
  },
  create(base) {
    return KeysResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseKeysResponse();
    message.keys = object.keys?.map((e) => e) || [];
    return message;
  }
};
messageTypeRegistry.set(KeysResponse.$type, KeysResponse);
function createBaseExistsResponse() {
  return { existingKeys: 0 };
}
var ExistsResponse = {
  $type: "devvit.plugin.redis.ExistsResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.existingKeys !== 0) {
      writer.uint32(8).int64(message.existingKeys);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseExistsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.existingKeys = longToNumber2(reader.int64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { existingKeys: isSet2(object.existingKeys) ? globalThis.Number(object.existingKeys) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.existingKeys !== 0) {
      obj.existingKeys = Math.round(message.existingKeys);
    }
    return obj;
  },
  create(base) {
    return ExistsResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseExistsResponse();
    message.existingKeys = object.existingKeys ?? 0;
    return message;
  }
};
messageTypeRegistry.set(ExistsResponse.$type, ExistsResponse);
function createBaseHGetRequest() {
  return { key: "", field: "", transactionId: void 0, scope: void 0 };
}
var HGetRequest = {
  $type: "devvit.plugin.redis.HGetRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.field !== "") {
      writer.uint32(18).string(message.field);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHGetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.field = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      field: isSet2(object.field) ? globalThis.String(object.field) : "",
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.field !== "") {
      obj.field = message.field;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HGetRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHGetRequest();
    message.key = object.key ?? "";
    message.field = object.field ?? "";
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HGetRequest.$type, HGetRequest);
function createBaseHMGetRequest() {
  return { key: "", fields: [], transactionId: void 0, scope: void 0 };
}
var HMGetRequest = {
  $type: "devvit.plugin.redis.HMGetRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.fields) {
      writer.uint32(18).string(v);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHMGetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.fields.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      fields: globalThis.Array.isArray(object?.fields) ? object.fields.map((e) => globalThis.String(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.fields?.length) {
      obj.fields = message.fields;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HMGetRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHMGetRequest();
    message.key = object.key ?? "";
    message.fields = object.fields?.map((e) => e) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HMGetRequest.$type, HMGetRequest);
function createBaseHSetRequest() {
  return { key: "", fv: [], transactionId: void 0, scope: void 0 };
}
var HSetRequest = {
  $type: "devvit.plugin.redis.HSetRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.fv) {
      RedisFieldValue.encode(v, writer.uint32(18).fork()).ldelim();
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHSetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.fv.push(RedisFieldValue.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      fv: globalThis.Array.isArray(object?.fv) ? object.fv.map((e) => RedisFieldValue.fromJSON(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.fv?.length) {
      obj.fv = message.fv.map((e) => RedisFieldValue.toJSON(e));
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HSetRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHSetRequest();
    message.key = object.key ?? "";
    message.fv = object.fv?.map((e) => RedisFieldValue.fromPartial(e)) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HSetRequest.$type, HSetRequest);
function createBaseHSetNXResponse() {
  return { success: 0 };
}
var HSetNXResponse = {
  $type: "devvit.plugin.redis.HSetNXResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.success !== 0) {
      writer.uint32(8).int64(message.success);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHSetNXResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.success = longToNumber2(reader.int64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { success: isSet2(object.success) ? globalThis.Number(object.success) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.success !== 0) {
      obj.success = Math.round(message.success);
    }
    return obj;
  },
  create(base) {
    return HSetNXResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHSetNXResponse();
    message.success = object.success ?? 0;
    return message;
  }
};
messageTypeRegistry.set(HSetNXResponse.$type, HSetNXResponse);
function createBaseHDelRequest() {
  return { key: "", fields: [], transactionId: void 0, scope: void 0 };
}
var HDelRequest = {
  $type: "devvit.plugin.redis.HDelRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.fields) {
      writer.uint32(18).string(v);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHDelRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.fields.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      fields: globalThis.Array.isArray(object?.fields) ? object.fields.map((e) => globalThis.String(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.fields?.length) {
      obj.fields = message.fields;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HDelRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHDelRequest();
    message.key = object.key ?? "";
    message.fields = object.fields?.map((e) => e) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HDelRequest.$type, HDelRequest);
function createBaseHScanRequest() {
  return { key: "", cursor: 0, pattern: void 0, count: void 0, transactionId: void 0, scope: void 0 };
}
var HScanRequest = {
  $type: "devvit.plugin.redis.HScanRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.cursor !== 0) {
      writer.uint32(16).uint64(message.cursor);
    }
    if (message.pattern !== void 0) {
      writer.uint32(26).string(message.pattern);
    }
    if (message.count !== void 0) {
      writer.uint32(32).int64(message.count);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(42).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHScanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.cursor = longToNumber2(reader.uint64());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.pattern = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.count = longToNumber2(reader.int64());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      cursor: isSet2(object.cursor) ? globalThis.Number(object.cursor) : 0,
      pattern: isSet2(object.pattern) ? globalThis.String(object.pattern) : void 0,
      count: isSet2(object.count) ? globalThis.Number(object.count) : void 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.cursor !== 0) {
      obj.cursor = Math.round(message.cursor);
    }
    if (message.pattern !== void 0) {
      obj.pattern = message.pattern;
    }
    if (message.count !== void 0) {
      obj.count = Math.round(message.count);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HScanRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHScanRequest();
    message.key = object.key ?? "";
    message.cursor = object.cursor ?? 0;
    message.pattern = object.pattern ?? void 0;
    message.count = object.count ?? void 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HScanRequest.$type, HScanRequest);
function createBaseHScanResponse() {
  return { cursor: 0, fieldValues: [] };
}
var HScanResponse = {
  $type: "devvit.plugin.redis.HScanResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.cursor !== 0) {
      writer.uint32(8).uint64(message.cursor);
    }
    for (const v of message.fieldValues) {
      RedisFieldValue.encode(v, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHScanResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.cursor = longToNumber2(reader.uint64());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.fieldValues.push(RedisFieldValue.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      cursor: isSet2(object.cursor) ? globalThis.Number(object.cursor) : 0,
      fieldValues: globalThis.Array.isArray(object?.fieldValues) ? object.fieldValues.map((e) => RedisFieldValue.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.cursor !== 0) {
      obj.cursor = Math.round(message.cursor);
    }
    if (message.fieldValues?.length) {
      obj.fieldValues = message.fieldValues.map((e) => RedisFieldValue.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return HScanResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHScanResponse();
    message.cursor = object.cursor ?? 0;
    message.fieldValues = object.fieldValues?.map((e) => RedisFieldValue.fromPartial(e)) || [];
    return message;
  }
};
messageTypeRegistry.set(HScanResponse.$type, HScanResponse);
function createBaseHIncrByRequest() {
  return { key: "", field: "", value: 0, transactionId: void 0, scope: void 0 };
}
var HIncrByRequest = {
  $type: "devvit.plugin.redis.HIncrByRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.field !== "") {
      writer.uint32(18).string(message.field);
    }
    if (message.value !== 0) {
      writer.uint32(24).int64(message.value);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(50).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHIncrByRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.field = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.value = longToNumber2(reader.int64());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      field: isSet2(object.field) ? globalThis.String(object.field) : "",
      value: isSet2(object.value) ? globalThis.Number(object.value) : 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.field !== "") {
      obj.field = message.field;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HIncrByRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHIncrByRequest();
    message.key = object.key ?? "";
    message.field = object.field ?? "";
    message.value = object.value ?? 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HIncrByRequest.$type, HIncrByRequest);
function createBaseRedisFieldValue() {
  return { field: "", value: "" };
}
var RedisFieldValue = {
  $type: "devvit.plugin.redis.RedisFieldValue",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.field !== "") {
      writer.uint32(10).string(message.field);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisFieldValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.field = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      field: isSet2(object.field) ? globalThis.String(object.field) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.field !== "") {
      obj.field = message.field;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return RedisFieldValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisFieldValue();
    message.field = object.field ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
messageTypeRegistry.set(RedisFieldValue.$type, RedisFieldValue);
function createBaseRedisFieldValues() {
  return { fieldValues: {} };
}
var RedisFieldValues = {
  $type: "devvit.plugin.redis.RedisFieldValues",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    Object.entries(message.fieldValues).forEach(([key, value]) => {
      RedisFieldValues_FieldValuesEntry.encode({ key, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisFieldValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          const entry1 = RedisFieldValues_FieldValuesEntry.decode(reader, reader.uint32());
          if (entry1.value !== void 0) {
            message.fieldValues[entry1.key] = entry1.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      fieldValues: isObject(object.fieldValues) ? Object.entries(object.fieldValues).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {}) : {}
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.fieldValues) {
      const entries = Object.entries(message.fieldValues);
      if (entries.length > 0) {
        obj.fieldValues = {};
        entries.forEach(([k, v]) => {
          obj.fieldValues[k] = v;
        });
      }
    }
    return obj;
  },
  create(base) {
    return RedisFieldValues.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisFieldValues();
    message.fieldValues = Object.entries(object.fieldValues ?? {}).reduce((acc, [key, value]) => {
      if (value !== void 0) {
        acc[key] = globalThis.String(value);
      }
      return acc;
    }, {});
    return message;
  }
};
messageTypeRegistry.set(RedisFieldValues.$type, RedisFieldValues);
function createBaseRedisFieldValues_FieldValuesEntry() {
  return { key: "", value: "" };
}
var RedisFieldValues_FieldValuesEntry = {
  $type: "devvit.plugin.redis.RedisFieldValues.FieldValuesEntry",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisFieldValues_FieldValuesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return RedisFieldValues_FieldValuesEntry.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisFieldValues_FieldValuesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
messageTypeRegistry.set(RedisFieldValues_FieldValuesEntry.$type, RedisFieldValues_FieldValuesEntry);
function createBaseKeyValuesRequest() {
  return { kv: [], transactionId: void 0, scope: void 0 };
}
var KeyValuesRequest = {
  $type: "devvit.plugin.redis.KeyValuesRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.kv) {
      RedisKeyValue.encode(v, writer.uint32(10).fork()).ldelim();
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(18).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseKeyValuesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.kv.push(RedisKeyValue.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      kv: globalThis.Array.isArray(object?.kv) ? object.kv.map((e) => RedisKeyValue.fromJSON(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.kv?.length) {
      obj.kv = message.kv.map((e) => RedisKeyValue.toJSON(e));
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return KeyValuesRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseKeyValuesRequest();
    message.kv = object.kv?.map((e) => RedisKeyValue.fromPartial(e)) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(KeyValuesRequest.$type, KeyValuesRequest);
function createBaseRedisKeyValue() {
  return { key: "", value: "" };
}
var RedisKeyValue = {
  $type: "devvit.plugin.redis.RedisKeyValue",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisKeyValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return RedisKeyValue.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisKeyValue();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
messageTypeRegistry.set(RedisKeyValue.$type, RedisKeyValue);
function createBaseRedisValues() {
  return { values: [] };
}
var RedisValues = {
  $type: "devvit.plugin.redis.RedisValues",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.values) {
      StringValue.encode({ value: v }, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRedisValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.values.push(StringValue.decode(reader, reader.uint32()).value);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { values: globalThis.Array.isArray(object?.values) ? object.values.map((e) => String(e)) : [] };
  },
  toJSON(message) {
    const obj = {};
    if (message.values?.length) {
      obj.values = message.values;
    }
    return obj;
  },
  create(base) {
    return RedisValues.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRedisValues();
    message.values = object.values?.map((e) => e) || [];
    return message;
  }
};
messageTypeRegistry.set(RedisValues.$type, RedisValues);
function createBaseExpireRequest() {
  return { key: "", seconds: 0, transactionId: void 0, scope: void 0 };
}
var ExpireRequest = {
  $type: "devvit.plugin.redis.ExpireRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.seconds !== 0) {
      writer.uint32(16).int32(message.seconds);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseExpireRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.seconds = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      seconds: isSet2(object.seconds) ? globalThis.Number(object.seconds) : 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.seconds !== 0) {
      obj.seconds = Math.round(message.seconds);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ExpireRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseExpireRequest();
    message.key = object.key ?? "";
    message.seconds = object.seconds ?? 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ExpireRequest.$type, ExpireRequest);
function createBaseZAddRequest() {
  return { key: "", members: [], transactionId: void 0, scope: void 0 };
}
var ZAddRequest = {
  $type: "devvit.plugin.redis.ZAddRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.members) {
      ZMember.encode(v, writer.uint32(18).fork()).ldelim();
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZAddRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.members.push(ZMember.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      members: globalThis.Array.isArray(object?.members) ? object.members.map((e) => ZMember.fromJSON(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.members?.length) {
      obj.members = message.members.map((e) => ZMember.toJSON(e));
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZAddRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZAddRequest();
    message.key = object.key ?? "";
    message.members = object.members?.map((e) => ZMember.fromPartial(e)) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZAddRequest.$type, ZAddRequest);
function createBaseZScanRequest() {
  return { key: "", cursor: 0, pattern: void 0, count: void 0, transactionId: void 0, scope: void 0 };
}
var ZScanRequest = {
  $type: "devvit.plugin.redis.ZScanRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.cursor !== 0) {
      writer.uint32(16).uint64(message.cursor);
    }
    if (message.pattern !== void 0) {
      writer.uint32(26).string(message.pattern);
    }
    if (message.count !== void 0) {
      writer.uint32(32).int64(message.count);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(42).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZScanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.cursor = longToNumber2(reader.uint64());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.pattern = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.count = longToNumber2(reader.int64());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      cursor: isSet2(object.cursor) ? globalThis.Number(object.cursor) : 0,
      pattern: isSet2(object.pattern) ? globalThis.String(object.pattern) : void 0,
      count: isSet2(object.count) ? globalThis.Number(object.count) : void 0,
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.cursor !== 0) {
      obj.cursor = Math.round(message.cursor);
    }
    if (message.pattern !== void 0) {
      obj.pattern = message.pattern;
    }
    if (message.count !== void 0) {
      obj.count = Math.round(message.count);
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return ZScanRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZScanRequest();
    message.key = object.key ?? "";
    message.cursor = object.cursor ?? 0;
    message.pattern = object.pattern ?? void 0;
    message.count = object.count ?? void 0;
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(ZScanRequest.$type, ZScanRequest);
function createBaseZScanResponse() {
  return { cursor: 0, members: [] };
}
var ZScanResponse = {
  $type: "devvit.plugin.redis.ZScanResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.cursor !== 0) {
      writer.uint32(8).uint64(message.cursor);
    }
    for (const v of message.members) {
      ZMember.encode(v, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZScanResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.cursor = longToNumber2(reader.uint64());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.members.push(ZMember.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      cursor: isSet2(object.cursor) ? globalThis.Number(object.cursor) : 0,
      members: globalThis.Array.isArray(object?.members) ? object.members.map((e) => ZMember.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.cursor !== 0) {
      obj.cursor = Math.round(message.cursor);
    }
    if (message.members?.length) {
      obj.members = message.members.map((e) => ZMember.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return ZScanResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZScanResponse();
    message.cursor = object.cursor ?? 0;
    message.members = object.members?.map((e) => ZMember.fromPartial(e)) || [];
    return message;
  }
};
messageTypeRegistry.set(ZScanResponse.$type, ZScanResponse);
function createBaseZMembers() {
  return { members: [] };
}
var ZMembers = {
  $type: "devvit.plugin.redis.ZMembers",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    for (const v of message.members) {
      ZMember.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZMembers();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.members.push(ZMember.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      members: globalThis.Array.isArray(object?.members) ? object.members.map((e) => ZMember.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.members?.length) {
      obj.members = message.members.map((e) => ZMember.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return ZMembers.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZMembers();
    message.members = object.members?.map((e) => ZMember.fromPartial(e)) || [];
    return message;
  }
};
messageTypeRegistry.set(ZMembers.$type, ZMembers);
function createBaseZMember() {
  return { score: 0, member: "" };
}
var ZMember = {
  $type: "devvit.plugin.redis.ZMember",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.score !== 0) {
      writer.uint32(9).double(message.score);
    }
    if (message.member !== "") {
      writer.uint32(18).string(message.member);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseZMember();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }
          message.score = reader.double();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.member = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      score: isSet2(object.score) ? globalThis.Number(object.score) : 0,
      member: isSet2(object.member) ? globalThis.String(object.member) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.score !== 0) {
      obj.score = message.score;
    }
    if (message.member !== "") {
      obj.member = message.member;
    }
    return obj;
  },
  create(base) {
    return ZMember.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseZMember();
    message.score = object.score ?? 0;
    message.member = object.member ?? "";
    return message;
  }
};
messageTypeRegistry.set(ZMember.$type, ZMember);
function createBaseTransactionId() {
  return { id: "" };
}
var TransactionId = {
  $type: "devvit.plugin.redis.TransactionId",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseTransactionId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { id: isSet2(object.id) ? globalThis.String(object.id) : "" };
  },
  toJSON(message) {
    const obj = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },
  create(base) {
    return TransactionId.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseTransactionId();
    message.id = object.id ?? "";
    return message;
  }
};
messageTypeRegistry.set(TransactionId.$type, TransactionId);
function createBaseWatchRequest() {
  return { transactionId: void 0, keys: [] };
}
var WatchRequest = {
  $type: "devvit.plugin.redis.WatchRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.keys) {
      writer.uint32(18).string(v);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseWatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.keys.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      keys: globalThis.Array.isArray(object?.keys) ? object.keys.map((e) => globalThis.String(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.keys?.length) {
      obj.keys = message.keys;
    }
    return obj;
  },
  create(base) {
    return WatchRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseWatchRequest();
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.keys = object.keys?.map((e) => e) || [];
    return message;
  }
};
messageTypeRegistry.set(WatchRequest.$type, WatchRequest);
function createBaseBitfieldRequest() {
  return { key: "", commands: [], transactionId: void 0, scope: void 0 };
}
var BitfieldRequest = {
  $type: "devvit.plugin.redis.BitfieldRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.commands) {
      BitfieldCommand.encode(v, writer.uint32(18).fork()).ldelim();
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(26).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.commands.push(BitfieldCommand.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      commands: globalThis.Array.isArray(object?.commands) ? object.commands.map((e) => BitfieldCommand.fromJSON(e)) : [],
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.commands?.length) {
      obj.commands = message.commands.map((e) => BitfieldCommand.toJSON(e));
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return BitfieldRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldRequest();
    message.key = object.key ?? "";
    message.commands = object.commands?.map((e) => BitfieldCommand.fromPartial(e)) || [];
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(BitfieldRequest.$type, BitfieldRequest);
function createBaseBitfieldCommand() {
  return { get: void 0, set: void 0, incrBy: void 0, overflow: void 0 };
}
var BitfieldCommand = {
  $type: "devvit.plugin.redis.BitfieldCommand",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.get !== void 0) {
      BitfieldGet.encode(message.get, writer.uint32(10).fork()).ldelim();
    }
    if (message.set !== void 0) {
      BitfieldSet.encode(message.set, writer.uint32(18).fork()).ldelim();
    }
    if (message.incrBy !== void 0) {
      BitfieldIncrBy.encode(message.incrBy, writer.uint32(26).fork()).ldelim();
    }
    if (message.overflow !== void 0) {
      BitfieldOverflow.encode(message.overflow, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.get = BitfieldGet.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.set = BitfieldSet.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.incrBy = BitfieldIncrBy.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.overflow = BitfieldOverflow.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      get: isSet2(object.get) ? BitfieldGet.fromJSON(object.get) : void 0,
      set: isSet2(object.set) ? BitfieldSet.fromJSON(object.set) : void 0,
      incrBy: isSet2(object.incrBy) ? BitfieldIncrBy.fromJSON(object.incrBy) : void 0,
      overflow: isSet2(object.overflow) ? BitfieldOverflow.fromJSON(object.overflow) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.get !== void 0) {
      obj.get = BitfieldGet.toJSON(message.get);
    }
    if (message.set !== void 0) {
      obj.set = BitfieldSet.toJSON(message.set);
    }
    if (message.incrBy !== void 0) {
      obj.incrBy = BitfieldIncrBy.toJSON(message.incrBy);
    }
    if (message.overflow !== void 0) {
      obj.overflow = BitfieldOverflow.toJSON(message.overflow);
    }
    return obj;
  },
  create(base) {
    return BitfieldCommand.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldCommand();
    message.get = object.get !== void 0 && object.get !== null ? BitfieldGet.fromPartial(object.get) : void 0;
    message.set = object.set !== void 0 && object.set !== null ? BitfieldSet.fromPartial(object.set) : void 0;
    message.incrBy = object.incrBy !== void 0 && object.incrBy !== null ? BitfieldIncrBy.fromPartial(object.incrBy) : void 0;
    message.overflow = object.overflow !== void 0 && object.overflow !== null ? BitfieldOverflow.fromPartial(object.overflow) : void 0;
    return message;
  }
};
messageTypeRegistry.set(BitfieldCommand.$type, BitfieldCommand);
function createBaseBitfieldGet() {
  return { encoding: "", offset: "" };
}
var BitfieldGet = {
  $type: "devvit.plugin.redis.BitfieldGet",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.encoding !== "") {
      writer.uint32(10).string(message.encoding);
    }
    if (message.offset !== "") {
      writer.uint32(18).string(message.offset);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldGet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.encoding = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.offset = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      encoding: isSet2(object.encoding) ? globalThis.String(object.encoding) : "",
      offset: isSet2(object.offset) ? globalThis.String(object.offset) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.encoding !== "") {
      obj.encoding = message.encoding;
    }
    if (message.offset !== "") {
      obj.offset = message.offset;
    }
    return obj;
  },
  create(base) {
    return BitfieldGet.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldGet();
    message.encoding = object.encoding ?? "";
    message.offset = object.offset ?? "";
    return message;
  }
};
messageTypeRegistry.set(BitfieldGet.$type, BitfieldGet);
function createBaseBitfieldSet() {
  return { encoding: "", offset: "", value: "" };
}
var BitfieldSet = {
  $type: "devvit.plugin.redis.BitfieldSet",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.encoding !== "") {
      writer.uint32(10).string(message.encoding);
    }
    if (message.offset !== "") {
      writer.uint32(18).string(message.offset);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldSet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.encoding = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.offset = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      encoding: isSet2(object.encoding) ? globalThis.String(object.encoding) : "",
      offset: isSet2(object.offset) ? globalThis.String(object.offset) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.encoding !== "") {
      obj.encoding = message.encoding;
    }
    if (message.offset !== "") {
      obj.offset = message.offset;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },
  create(base) {
    return BitfieldSet.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldSet();
    message.encoding = object.encoding ?? "";
    message.offset = object.offset ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
messageTypeRegistry.set(BitfieldSet.$type, BitfieldSet);
function createBaseBitfieldIncrBy() {
  return { encoding: "", offset: "", increment: "" };
}
var BitfieldIncrBy = {
  $type: "devvit.plugin.redis.BitfieldIncrBy",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.encoding !== "") {
      writer.uint32(10).string(message.encoding);
    }
    if (message.offset !== "") {
      writer.uint32(18).string(message.offset);
    }
    if (message.increment !== "") {
      writer.uint32(26).string(message.increment);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldIncrBy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.encoding = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.offset = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.increment = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      encoding: isSet2(object.encoding) ? globalThis.String(object.encoding) : "",
      offset: isSet2(object.offset) ? globalThis.String(object.offset) : "",
      increment: isSet2(object.increment) ? globalThis.String(object.increment) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.encoding !== "") {
      obj.encoding = message.encoding;
    }
    if (message.offset !== "") {
      obj.offset = message.offset;
    }
    if (message.increment !== "") {
      obj.increment = message.increment;
    }
    return obj;
  },
  create(base) {
    return BitfieldIncrBy.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldIncrBy();
    message.encoding = object.encoding ?? "";
    message.offset = object.offset ?? "";
    message.increment = object.increment ?? "";
    return message;
  }
};
messageTypeRegistry.set(BitfieldIncrBy.$type, BitfieldIncrBy);
function createBaseBitfieldOverflow() {
  return { behavior: 0 };
}
var BitfieldOverflow = {
  $type: "devvit.plugin.redis.BitfieldOverflow",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.behavior !== 0) {
      writer.uint32(8).int32(message.behavior);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldOverflow();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.behavior = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { behavior: isSet2(object.behavior) ? bitfieldOverflowBehaviorFromJSON(object.behavior) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.behavior !== 0) {
      obj.behavior = bitfieldOverflowBehaviorToJSON(message.behavior);
    }
    return obj;
  },
  create(base) {
    return BitfieldOverflow.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldOverflow();
    message.behavior = object.behavior ?? 0;
    return message;
  }
};
messageTypeRegistry.set(BitfieldOverflow.$type, BitfieldOverflow);
function createBaseBitfieldResponse() {
  return { results: [] };
}
var BitfieldResponse = {
  $type: "devvit.plugin.redis.BitfieldResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    writer.uint32(10).fork();
    for (const v of message.results) {
      writer.int64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseBitfieldResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.results.push(longToNumber2(reader.int64()));
            continue;
          }
          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.results.push(longToNumber2(reader.int64()));
            }
            continue;
          }
          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      results: globalThis.Array.isArray(object?.results) ? object.results.map((e) => globalThis.Number(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.results?.length) {
      obj.results = message.results.map((e) => Math.round(e));
    }
    return obj;
  },
  create(base) {
    return BitfieldResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseBitfieldResponse();
    message.results = object.results?.map((e) => e) || [];
    return message;
  }
};
messageTypeRegistry.set(BitfieldResponse.$type, BitfieldResponse);
function createBaseHSetNXRequest() {
  return { key: "", field: "", value: "", transactionId: void 0, scope: void 0 };
}
var HSetNXRequest = {
  $type: "devvit.plugin.redis.HSetNXRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.field !== "") {
      writer.uint32(18).string(message.field);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    if (message.transactionId !== void 0) {
      TransactionId.encode(message.transactionId, writer.uint32(34).fork()).ldelim();
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHSetNXRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.field = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.value = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.transactionId = TransactionId.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      field: isSet2(object.field) ? globalThis.String(object.field) : "",
      value: isSet2(object.value) ? globalThis.String(object.value) : "",
      transactionId: isSet2(object.transactionId) ? TransactionId.fromJSON(object.transactionId) : void 0,
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.field !== "") {
      obj.field = message.field;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.transactionId !== void 0) {
      obj.transactionId = TransactionId.toJSON(message.transactionId);
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return HSetNXRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHSetNXRequest();
    message.key = object.key ?? "";
    message.field = object.field ?? "";
    message.value = object.value ?? "";
    message.transactionId = object.transactionId !== void 0 && object.transactionId !== null ? TransactionId.fromPartial(object.transactionId) : void 0;
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(HSetNXRequest.$type, HSetNXRequest);
function createBaseRenameRequest() {
  return { key: "", newKey: "", scope: void 0 };
}
var RenameRequest = {
  $type: "devvit.plugin.redis.RenameRequest",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.newKey !== "") {
      writer.uint32(18).string(message.newKey);
    }
    if (message.scope !== void 0) {
      writer.uint32(800).int32(message.scope);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRenameRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.newKey = reader.string();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }
          message.scope = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? globalThis.String(object.key) : "",
      newKey: isSet2(object.newKey) ? globalThis.String(object.newKey) : "",
      scope: isSet2(object.scope) ? redisKeyScopeFromJSON(object.scope) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.newKey !== "") {
      obj.newKey = message.newKey;
    }
    if (message.scope !== void 0) {
      obj.scope = redisKeyScopeToJSON(message.scope);
    }
    return obj;
  },
  create(base) {
    return RenameRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRenameRequest();
    message.key = object.key ?? "";
    message.newKey = object.newKey ?? "";
    message.scope = object.scope ?? void 0;
    return message;
  }
};
messageTypeRegistry.set(RenameRequest.$type, RenameRequest);
function createBaseRenameResponse() {
  return { result: "" };
}
var RenameResponse = {
  $type: "devvit.plugin.redis.RenameResponse",
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.result !== "") {
      writer.uint32(10).string(message.result);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseRenameResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.result = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { result: isSet2(object.result) ? globalThis.String(object.result) : "" };
  },
  toJSON(message) {
    const obj = {};
    if (message.result !== "") {
      obj.result = message.result;
    }
    return obj;
  },
  create(base) {
    return RenameResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseRenameResponse();
    message.result = object.result ?? "";
    return message;
  }
};
messageTypeRegistry.set(RenameResponse.$type, RenameResponse);
var RedisAPIDefinition = {
  name: "RedisAPI",
  fullName: "devvit.plugin.redis.RedisAPI",
  methods: {
    /** Simple Key-Value operations */
    get: {
      name: "Get",
      requestType: KeyRequest,
      requestStream: false,
      responseType: StringValue,
      responseStream: false,
      options: {}
    },
    getBytes: {
      name: "GetBytes",
      requestType: KeyRequest,
      requestStream: false,
      responseType: BytesValue,
      responseStream: false,
      options: {}
    },
    set: {
      name: "Set",
      requestType: SetRequest,
      requestStream: false,
      responseType: StringValue,
      responseStream: false,
      options: {}
    },
    exists: {
      name: "Exists",
      requestType: KeysRequest,
      requestStream: false,
      responseType: ExistsResponse,
      responseStream: false,
      options: {}
    },
    del: {
      name: "Del",
      requestType: KeysRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    type: {
      name: "Type",
      requestType: KeyRequest,
      requestStream: false,
      responseType: StringValue,
      responseStream: false,
      options: {}
    },
    rename: {
      name: "Rename",
      requestType: RenameRequest,
      requestStream: false,
      responseType: RenameResponse,
      responseStream: false,
      options: {}
    },
    /** Number operations */
    incrBy: {
      name: "IncrBy",
      requestType: IncrByRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    /** Redis Hash operations */
    hSet: {
      name: "HSet",
      requestType: HSetRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    hGet: {
      name: "HGet",
      requestType: HGetRequest,
      requestStream: false,
      responseType: StringValue,
      responseStream: false,
      options: {}
    },
    hMGet: {
      name: "HMGet",
      requestType: HMGetRequest,
      requestStream: false,
      responseType: RedisValues,
      responseStream: false,
      options: {}
    },
    hGetAll: {
      name: "HGetAll",
      requestType: KeyRequest,
      requestStream: false,
      responseType: RedisFieldValues,
      responseStream: false,
      options: {}
    },
    hDel: {
      name: "HDel",
      requestType: HDelRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    hScan: {
      name: "HScan",
      requestType: HScanRequest,
      requestStream: false,
      responseType: HScanResponse,
      responseStream: false,
      options: {}
    },
    hKeys: {
      name: "HKeys",
      requestType: KeyRequest,
      requestStream: false,
      responseType: KeysResponse,
      responseStream: false,
      options: {}
    },
    hIncrBy: {
      name: "HIncrBy",
      requestType: HIncrByRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    hLen: {
      name: "HLen",
      requestType: KeyRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    hSetNX: {
      name: "HSetNX",
      requestType: HSetNXRequest,
      requestStream: false,
      responseType: HSetNXResponse,
      responseStream: false,
      options: {}
    },
    /** Transactions */
    multi: {
      name: "Multi",
      requestType: TransactionId,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {}
    },
    exec: {
      name: "Exec",
      requestType: TransactionId,
      requestStream: false,
      responseType: TransactionResponses,
      responseStream: false,
      options: {}
    },
    discard: {
      name: "Discard",
      requestType: TransactionId,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {}
    },
    watch: {
      name: "Watch",
      requestType: WatchRequest,
      requestStream: false,
      responseType: TransactionId,
      responseStream: false,
      options: {}
    },
    unwatch: {
      name: "Unwatch",
      requestType: TransactionId,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {}
    },
    /** String operations */
    getRange: {
      name: "GetRange",
      requestType: KeyRangeRequest,
      requestStream: false,
      responseType: StringValue,
      responseStream: false,
      options: {}
    },
    setRange: {
      name: "SetRange",
      requestType: SetRangeRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    strlen: {
      name: "Strlen",
      requestType: KeyRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    /** Batch Key-Value operations */
    mGet: {
      name: "MGet",
      requestType: KeysRequest,
      requestStream: false,
      responseType: RedisValues,
      responseStream: false,
      options: {}
    },
    mSet: {
      name: "MSet",
      requestType: KeyValuesRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {}
    },
    /** Key expiration */
    expire: {
      name: "Expire",
      requestType: ExpireRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {}
    },
    expireTime: {
      name: "ExpireTime",
      requestType: KeyRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    /** Sorted sets */
    zAdd: {
      name: "ZAdd",
      requestType: ZAddRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zCard: {
      name: "ZCard",
      requestType: KeyRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zRange: {
      name: "ZRange",
      requestType: ZRangeRequest,
      requestStream: false,
      responseType: ZMembers,
      responseStream: false,
      options: {}
    },
    zRem: {
      name: "ZRem",
      requestType: ZRemRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zRemRangeByLex: {
      name: "ZRemRangeByLex",
      requestType: ZRemRangeByLexRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zRemRangeByRank: {
      name: "ZRemRangeByRank",
      requestType: ZRemRangeByRankRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zRemRangeByScore: {
      name: "ZRemRangeByScore",
      requestType: ZRemRangeByScoreRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zScore: {
      name: "ZScore",
      requestType: ZScoreRequest,
      requestStream: false,
      responseType: DoubleValue,
      responseStream: false,
      options: {}
    },
    zRank: {
      name: "ZRank",
      requestType: ZRankRequest,
      requestStream: false,
      responseType: Int64Value,
      responseStream: false,
      options: {}
    },
    zIncrBy: {
      name: "ZIncrBy",
      requestType: ZIncrByRequest,
      requestStream: false,
      responseType: DoubleValue,
      responseStream: false,
      options: {}
    },
    zScan: {
      name: "ZScan",
      requestType: ZScanRequest,
      requestStream: false,
      responseType: ZScanResponse,
      responseStream: false,
      options: {}
    },
    /** Bitfield */
    bitfield: {
      name: "Bitfield",
      requestType: BitfieldRequest,
      requestStream: false,
      responseType: BitfieldResponse,
      responseStream: false,
      options: {}
    }
  }
};
function longToNumber2(long) {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}
if (import_minimal3.default.util.Long !== long_default) {
  import_minimal3.default.util.Long = long_default;
  import_minimal3.default.configure();
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isSet2(value) {
  return value !== null && value !== void 0;
}

// node_modules/@devvit/shared-types/server/get-devvit-config.js
function getDevvitConfig() {
  if (!globalThis.devvit?.config) {
    throw new Error("Devvit config is not available. Make sure to call getDevvitConfig() after the Devvit runtime has been initialized.");
  }
  return globalThis.devvit.config;
}

// node_modules/@devvit/redis/RedisClient.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TxClient_instances;
var _TxClient_plugin;
var _TxClient_transactionId;
var _TxClient_txnStartMetadata;
var _TxClient_metadata_get;
var _RedisClient_instances;
var _RedisClient_metadata_get;
var _RedisClient_plugin_get;
var TxClient = class {
  constructor(plugin, transactionId, metadata) {
    _TxClient_instances.add(this);
    _TxClient_plugin.set(this, void 0);
    _TxClient_transactionId.set(this, void 0);
    _TxClient_txnStartMetadata.set(this, void 0);
    __classPrivateFieldSet(this, _TxClient_plugin, plugin, "f");
    __classPrivateFieldSet(this, _TxClient_transactionId, transactionId, "f");
    __classPrivateFieldSet(this, _TxClient_txnStartMetadata, metadata, "f");
  }
  async get(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Get({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async multi() {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Multi(__classPrivateFieldGet(this, _TxClient_transactionId, "f"), __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
  }
  async set(key, value, options) {
    let expiration;
    if (options?.expiration) {
      expiration = Math.floor((options.expiration.getTime() - Date.now()) / 1e3);
      if (expiration < 1) {
        expiration = 1;
      }
    }
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Set({
      key,
      value,
      nx: options?.nx === true,
      xx: options?.xx === true,
      expiration: expiration || 0,
      transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f")
    }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async del(...keys) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Del({ keys, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async type(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Type({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exec() {
    const response = await __classPrivateFieldGet(this, _TxClient_plugin, "f").Exec(__classPrivateFieldGet(this, _TxClient_transactionId, "f"), __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    let output = [];
    for (const result of response.response) {
      if (result.members) {
        output.push(result.members);
      } else if (result.nil !== void 0) {
        output.push(null);
      } else if (result.num !== void 0) {
        output.push(result.num);
      } else if (result.values !== void 0) {
        output.push(result.values.values);
      } else if (result.str !== void 0) {
        output.push(result.str);
      } else if (result.dbl !== void 0) {
        output.push(result.dbl);
      }
    }
    return output;
  }
  async discard() {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Discard(__classPrivateFieldGet(this, _TxClient_transactionId, "f"), __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
  }
  async watch(...keys) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Watch({ keys, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async unwatch() {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Unwatch(__classPrivateFieldGet(this, _TxClient_transactionId, "f"), __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async getRange(key, start, end) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").GetRange({ key, start, end, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async setRange(key, offset, value) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").SetRange({ key, offset, value, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async strLen(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Strlen({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async mGet(keys) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").MGet({ keys, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async mSet(keyValues) {
    const kv = Object.entries(keyValues).map(([key, value]) => ({ key, value }));
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").MSet({ kv, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async incrBy(key, value) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").IncrBy({ key, value, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async expire(key, seconds) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").Expire({ key, seconds, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async expireTime(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ExpireTime({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zAdd(key, ...members) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZAdd({ key, members, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zScore(key, member) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZScore({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, member }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRank(key, member) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRank({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, member }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zIncrBy(key, member, value) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZIncrBy({ key, member, value, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zScan(key, cursor, pattern, count) {
    const request = {
      key,
      cursor,
      pattern,
      count,
      transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f")
    };
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZScan(request, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zCard(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZCard({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRange(key, start, stop, options) {
    let opts = { rev: false, byLex: false, byScore: false, offset: 0, count: 1e3 };
    if (options?.reverse) {
      opts.rev = options.reverse;
    }
    if (options?.by === "lex") {
      opts.byLex = true;
    } else if (options?.by === "score") {
      opts.byScore = true;
    }
    if (options?.limit) {
      if (opts.byLex || opts.byScore) {
        opts.offset = options.limit.offset;
        opts.count = options.limit.count;
      } else {
        throw new Error(`zRange parsing error: 'limit' only allowed when 'options.by' is 'lex' or 'score'`);
      }
    }
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRange({
      key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") },
      start: start + "",
      stop: stop + "",
      ...opts
    }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRem(key, members) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRem({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, members }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRemRangeByLex(key, min, max) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRemRangeByLex({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, min, max }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRemRangeByRank(key, start, stop) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRemRangeByRank({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, start, stop }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async zRemRangeByScore(key, min, max) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").ZRemRangeByScore({ key: { key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, min, max }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hGetAll(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HGetAll({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hGet(key, field) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HGet({ key, field, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hMGet(key, fields) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HMGet({ key, fields, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hSet(key, fieldValues) {
    const fv = Object.entries(fieldValues).map(([field, value]) => ({ field, value }));
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HSet({ key, fv, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hSetNX(key, field, value) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HSetNX({ key, field, value, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hIncrBy(key, field, value) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HIncrBy({ key, field, value, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hDel(key, fields) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HDel({ key, fields, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hScan(key, cursor, pattern, count) {
    const request = {
      key,
      cursor,
      pattern,
      count,
      transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f")
    };
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HScan(request, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hKeys(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HKeys({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
  async hLen(key) {
    await __classPrivateFieldGet(this, _TxClient_plugin, "f").HLen({ key, transactionId: __classPrivateFieldGet(this, _TxClient_transactionId, "f") }, __classPrivateFieldGet(this, _TxClient_instances, "a", _TxClient_metadata_get));
    return this;
  }
};
_TxClient_plugin = /* @__PURE__ */ new WeakMap(), _TxClient_transactionId = /* @__PURE__ */ new WeakMap(), _TxClient_txnStartMetadata = /* @__PURE__ */ new WeakMap(), _TxClient_instances = /* @__PURE__ */ new WeakSet(), _TxClient_metadata_get = function _TxClient_metadata_get2() {
  assertTxMetadataIsCurrent(__classPrivateFieldGet(this, _TxClient_txnStartMetadata, "f"));
  return __classPrivateFieldGet(this, _TxClient_txnStartMetadata, "f");
};
var RedisClient = class _RedisClient {
  constructor(scope) {
    _RedisClient_instances.add(this);
    this.scope = scope;
    this.global = scope === RedisKeyScope.INSTALLATION ? new _RedisClient(RedisKeyScope.GLOBAL) : this;
  }
  async watch(...keys) {
    const txId = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Watch({ keys }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return new TxClient(__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get), txId, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async get(key) {
    try {
      const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Get({ key, scope: this.scope }, {
        ...__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get),
        "throw-redis-nil": { values: ["true"] }
      });
      return response !== null ? response.value ?? void 0 : response;
    } catch (e) {
      if (isRedisNilError(e)) {
        return void 0;
      }
      throw e;
    }
  }
  async getBuffer(key) {
    try {
      const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).GetBytes({ key, scope: this.scope }, {
        ...__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get),
        "throw-redis-nil": { values: ["true"] }
      });
      return response !== null ? Buffer.from(response.value) : response;
    } catch (e) {
      if (isRedisNilError(e)) {
        return void 0;
      }
      throw e;
    }
  }
  async set(key, value, options) {
    let expiration;
    if (options?.expiration) {
      expiration = Math.floor((options.expiration.getTime() - Date.now()) / 1e3);
      if (expiration < 1) {
        expiration = 1;
      }
    }
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Set({
      key,
      value,
      nx: options?.nx === true && !options.xx,
      xx: options?.xx === true && !options.nx,
      expiration: expiration || 0,
      scope: this.scope
    }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async exists(...keys) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Exists({ keys, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.existingKeys;
  }
  async del(...keys) {
    await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Del({ keys, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async incrBy(key, value) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).IncrBy({ key, value, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async getRange(key, start, end) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).GetRange({ key, start, end, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.value : response;
  }
  async setRange(key, offset, value) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).SetRange({ key, offset, value, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async strLen(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Strlen({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async expire(key, seconds) {
    await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Expire({ key, seconds, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async expireTime(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ExpireTime({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async zAdd(key, ...members) {
    return (await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZAdd({ key, members, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get))).value;
  }
  async zRange(key, start, stop, options) {
    let opts = { rev: false, byLex: false, byScore: false, offset: 0, count: 1e3 };
    if (options?.reverse) {
      opts.rev = options.reverse;
    }
    if (options?.by === "lex") {
      opts.byLex = true;
    } else if (options?.by === "score") {
      opts.byScore = true;
    } else {
      opts.offset = 0;
      opts.count = 0;
    }
    if (options?.limit) {
      if (opts.byLex || opts.byScore) {
        opts.offset = options.limit.offset;
        opts.count = options.limit.count;
      } else {
        throw new Error(`zRange parsing error: 'limit' only allowed when 'options.by' is 'lex' or 'score'`);
      }
    }
    return (await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRange({ key: { key }, start: start + "", stop: stop + "", ...opts, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get))).members;
  }
  async zRem(key, members) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRem({ key: { key }, members, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async zRemRangeByLex(key, min, max) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRemRangeByLex({ key: { key }, min, max, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async zRemRangeByRank(key, start, stop) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRemRangeByRank({ key: { key }, start, stop, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async zRemRangeByScore(key, min, max) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRemRangeByScore({ key: { key }, min, max, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async zScore(key, member) {
    try {
      const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZScore({ key: { key }, member, scope: this.scope }, {
        ...__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get),
        "throw-redis-nil": { values: ["true"] }
      });
      return response !== null ? response.value : response;
    } catch (e) {
      if (isRedisNilError(e)) {
        return void 0;
      }
      throw e;
    }
  }
  async zRank(key, member) {
    try {
      const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZRank({ key: { key }, member, scope: this.scope }, {
        ...__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get),
        "throw-redis-nil": { values: ["true"] }
      });
      return response !== null ? response.value : response;
    } catch (e) {
      if (isRedisNilError(e)) {
        return void 0;
      }
      throw e;
    }
  }
  async zIncrBy(key, member, value) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZIncrBy({ key, member, value, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.value : response;
  }
  async mGet(keys) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).MGet({ keys, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.values.map((value) => value || null) : response;
  }
  async mSet(keyValues) {
    const kv = Object.entries(keyValues).map(([key, value]) => ({ key, value }));
    await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).MSet({ kv, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async zCard(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZCard({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.value : response;
  }
  async zScan(key, cursor, pattern, count) {
    const request = { key, cursor, pattern, count, scope: this.scope };
    return await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).ZScan(request, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async type(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Type({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.value : response;
  }
  async rename(key, newKey) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Rename({ key, newKey, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.result;
  }
  async hGet(key, field) {
    try {
      const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HGet({ key, field, scope: this.scope }, {
        ...__classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get),
        "throw-redis-nil": { values: ["true"] }
      });
      return response !== null ? response.value ?? void 0 : response;
    } catch (e) {
      if (isRedisNilError(e)) {
        return void 0;
      }
      throw e;
    }
  }
  async hMGet(key, fields) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HMGet({ key, fields, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.values.map((value) => value || null) : response;
  }
  async hSet(key, fieldValues) {
    const fv = Object.entries(fieldValues).map(([field, value]) => ({ field, value }));
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HSet({ key, fv, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async hSetNX(key, field, value) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HSetNX({ key, field, value, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.success;
  }
  async hGetAll(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HGetAll({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.fieldValues : response;
  }
  async hDel(key, fields) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HDel({ key, fields, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async hScan(key, cursor, pattern, count) {
    const request = { key, cursor, pattern, count, scope: this.scope };
    return await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HScan(request, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
  }
  async hKeys(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HKeys({ key, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response !== null ? response.keys : response;
  }
  async hIncrBy(key, field, value) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HIncrBy({ key, field, value, scope: this.scope }, __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_metadata_get));
    return response.value;
  }
  async hLen(key) {
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).HLen({
      key,
      scope: this.scope
    });
    return response.value;
  }
  async bitfield(key, ...cmds) {
    const commands = [];
    for (let argIndex = 0; argIndex < cmds.length; ) {
      const currentArg = cmds[argIndex];
      const command = {};
      switch (currentArg) {
        case "get": {
          if (argIndex + 2 >= cmds.length) {
            throw Error(`bitfield command parse failed; not enough arguments for 'get' command`);
          }
          command.get = {
            encoding: cmds[argIndex + 1],
            offset: cmds[argIndex + 2].toString()
          };
          argIndex += 3;
          break;
        }
        case "set": {
          if (argIndex + 3 >= cmds.length) {
            throw Error(`bitfield command parse failed; not enough arguments for 'set' command`);
          }
          command.set = {
            encoding: cmds[argIndex + 1],
            offset: cmds[argIndex + 2].toString(),
            value: cmds[argIndex + 3].toString()
          };
          argIndex += 4;
          break;
        }
        case "incrBy": {
          if (argIndex + 3 >= cmds.length) {
            throw Error(`bitfield command parse failed; not enough arguments for 'incrBy' command`);
          }
          command.incrBy = {
            encoding: cmds[argIndex + 1],
            offset: cmds[argIndex + 2].toString(),
            increment: cmds[argIndex + 3].toString()
          };
          argIndex += 4;
          break;
        }
        case "overflow": {
          if (argIndex + 1 >= cmds.length) {
            throw Error(`bitfield command parse failed; not enough arguments for 'overflow' command`);
          }
          const behavior = cmds[argIndex + 1].toString();
          command.overflow = {
            behavior: toBehaviorProto(behavior)
          };
          argIndex += 2;
          break;
        }
        default: {
          throw Error(`bitfield command parse failed; ${currentArg} unrecognized (must be 'get', 'set', 'incrBy', or 'overflow')`);
        }
      }
      commands.push(command);
    }
    const response = await __classPrivateFieldGet(this, _RedisClient_instances, "a", _RedisClient_plugin_get).Bitfield({
      key,
      commands,
      scope: this.scope
    });
    return response.results;
  }
};
_RedisClient_instances = /* @__PURE__ */ new WeakSet(), _RedisClient_metadata_get = function _RedisClient_metadata_get2() {
  return context.metadata;
}, _RedisClient_plugin_get = function _RedisClient_plugin_get2() {
  return getDevvitConfig().use(RedisAPIDefinition);
};
function toBehaviorProto(behavior) {
  const lowercase = behavior.toLowerCase();
  switch (lowercase) {
    case "wrap":
      return BitfieldOverflowBehavior.BITFIELD_OVERFLOW_BEHAVIOR_WRAP;
    case "sat":
      return BitfieldOverflowBehavior.BITFIELD_OVERFLOW_BEHAVIOR_SAT;
    case "fail":
      return BitfieldOverflowBehavior.BITFIELD_OVERFLOW_BEHAVIOR_FAIL;
    default:
      throw Error(`unknown bitfield overflow behavior: ${lowercase}`);
  }
}
function isRedisNilError(e) {
  if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
    return e.message.includes("redis: nil");
  } else {
    return false;
  }
}
function assertTxMetadataIsCurrent(metadata) {
  if (context.metadata !== metadata) {
    throw new Error(`TxClient: Current metadata does not match what was used to start the transaction. Don't pass clients around between calls!`);
  }
}

// node_modules/@devvit/redis/redisCompression.js
var import_node_zlib = require("node:zlib");
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RedisCompressionProxy_client;
var COMPRESSION_ALGO = "gz";
var ENCODING_ALGO = "b64";
var REDIS_COMPRESSION_PREFIX = `__${COMPRESSION_ALGO}:${ENCODING_ALGO}__:`;
var MIN_COMPRESSION_LENGTH = 80;
var compress = (value) => {
  if (value.length < MIN_COMPRESSION_LENGTH)
    return value;
  try {
    const compressed = (0, import_node_zlib.gzipSync)(value);
    return `${REDIS_COMPRESSION_PREFIX}${compressed.toString("base64")}`;
  } catch {
    return value;
  }
};
var decompress = (value) => {
  if (!value.startsWith(REDIS_COMPRESSION_PREFIX))
    return value;
  try {
    const buffer = Buffer.from(value.slice(REDIS_COMPRESSION_PREFIX.length), "base64");
    return (0, import_node_zlib.gunzipSync)(buffer).toString("utf-8");
  } catch {
    return value;
  }
};
var RedisCompressionProxy = class _RedisCompressionProxy {
  constructor(client) {
    _RedisCompressionProxy_client.set(this, void 0);
    __classPrivateFieldSet2(this, _RedisCompressionProxy_client, client, "f");
    this.global = client.scope === RedisKeyScope.INSTALLATION ? new _RedisCompressionProxy(client.global) : this;
  }
  async get(key) {
    const val = await __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").get(key);
    if (!val)
      return val;
    return val.startsWith(REDIS_COMPRESSION_PREFIX) ? decompress(val) : val;
  }
  async set(key, value, options) {
    const compressed = compress(value);
    const toStore = compressed.length < value.length ? compressed : value;
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").set(key, toStore, options);
  }
  async hGet(key, field) {
    const val = await __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hGet(key, field);
    if (!val)
      return val;
    return val.startsWith(REDIS_COMPRESSION_PREFIX) ? decompress(val) : val;
  }
  async hSet(key, fieldValues) {
    const newFieldValues = {};
    for (const [field, value] of Object.entries(fieldValues)) {
      const compressed = compress(value);
      newFieldValues[field] = compressed.length < value.length ? compressed : value;
    }
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hSet(key, newFieldValues);
  }
  async hSetNX(key, field, value) {
    const compressed = compress(value);
    const toStore = compressed.length < value.length ? compressed : value;
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hSetNX(key, field, toStore);
  }
  async hGetAll(key) {
    const all = await __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hGetAll(key);
    if (!all) {
      return all;
    }
    const result = {};
    for (const [field, value] of Object.entries(all)) {
      result[field] = value.startsWith(REDIS_COMPRESSION_PREFIX) ? decompress(value) : value;
    }
    return result;
  }
  async hMGet(key, fields) {
    const values = await __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hMGet(key, fields);
    return values.map((val) => {
      if (val?.startsWith(REDIS_COMPRESSION_PREFIX)) {
        return decompress(val);
      }
      return val;
    });
  }
  async mGet(keys) {
    const values = await __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").mGet(keys);
    return values.map((val) => {
      if (val?.startsWith(REDIS_COMPRESSION_PREFIX)) {
        return decompress(val);
      }
      return val;
    });
  }
  async mSet(keyValues) {
    const newKeyValues = {};
    for (const [key, value] of Object.entries(keyValues)) {
      const compressed = compress(value);
      newKeyValues[key] = compressed.length < value.length ? compressed : value;
    }
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").mSet(newKeyValues);
  }
  watch(...keys) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").watch(...keys);
  }
  getBuffer(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").getBuffer(key);
  }
  exists(...keys) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").exists(...keys);
  }
  del(...keys) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").del(...keys);
  }
  type(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").type(key);
  }
  rename(key, newKey) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").rename(key, newKey);
  }
  getRange(key, start, end) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").getRange(key, start, end);
  }
  setRange(key, offset, value) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").setRange(key, offset, value);
  }
  strLen(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").strLen(key);
  }
  incrBy(key, value) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").incrBy(key, value);
  }
  expire(key, seconds) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").expire(key, seconds);
  }
  expireTime(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").expireTime(key);
  }
  zAdd(key, ...members) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zAdd(key, ...members);
  }
  zCard(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zCard(key);
  }
  zScore(key, member) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zScore(key, member);
  }
  zRank(key, member) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRank(key, member);
  }
  zIncrBy(key, member, value) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zIncrBy(key, member, value);
  }
  zRange(key, start, stop, options) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRange(key, start, stop, options);
  }
  zRem(key, members) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRem(key, members);
  }
  zRemRangeByLex(key, min, max) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRemRangeByLex(key, min, max);
  }
  zRemRangeByRank(key, start, stop) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRemRangeByRank(key, start, stop);
  }
  zRemRangeByScore(key, min, max) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zRemRangeByScore(key, min, max);
  }
  zScan(key, cursor, pattern, count) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").zScan(key, cursor, pattern, count);
  }
  hDel(key, fields) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hDel(key, fields);
  }
  hScan(key, cursor, pattern, count) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hScan(key, cursor, pattern, count);
  }
  hKeys(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hKeys(key);
  }
  hIncrBy(key, field, value) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hIncrBy(key, field, value);
  }
  hLen(key) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").hLen(key);
  }
  bitfield(key, ...cmds) {
    return __classPrivateFieldGet2(this, _RedisCompressionProxy_client, "f").bitfield(key, ...cmds);
  }
};
_RedisCompressionProxy_client = /* @__PURE__ */ new WeakMap();

// node_modules/@devvit/redis/index.js
var redisClientImpl = new RedisClient(RedisKeyScope.INSTALLATION);
var redis = redisClientImpl;
var redisCompressed = new RedisCompressionProxy(redisClientImpl);

// src/devvit/queue.ts
var QUEUE_KEY = "ab:queue";
var RECENT_TTL_SECONDS = 86400;
var RECENT_RETRY_MS = 15e3;
var MATCHED_TTL_SECONDS = 300;
var QUEUE_TIMEOUT_MS = 3e4;
function matchedKey(playerId) {
  return `ab:matched:${playerId}`;
}
function recentKey(playerIdA, playerIdB) {
  const [a, b] = [playerIdA, playerIdB].sort();
  return `ab:recent:${a}:${b}`;
}
async function createLobby(redis2, initialMeta) {
  const code = crypto.randomUUID().slice(0, 8).toUpperCase();
  const meta = {
    code,
    config: {},
    status: "waiting",
    hostPeerId: "",
    createdAt: Date.now(),
    ...initialMeta
  };
  await redis2.set(`ab:lobby:${code}:meta`, JSON.stringify(meta));
  await redis2.expire(`ab:lobby:${code}:meta`, 3600);
  return code;
}
async function getQueuePlayers(redis2) {
  const entries = await redis2.zRange(QUEUE_KEY, 0, -1, { by: "rank" });
  if (!entries || entries.length === 0) {
    return [];
  }
  return entries.map((entry) => ({
    playerId: entry.member,
    queuedAt: Math.floor(entry.score)
  }));
}
async function isRecentMatch(redis2, playerA, playerB) {
  const key = recentKey(playerA, playerB);
  return await redis2.exists(key) > 0;
}
async function tryMatchQueue(redis2, options) {
  const players = await getQueuePlayers(redis2);
  if (players.length < 2 && !options?.allowBotFallback) {
    return { matched: false };
  }
  const now = Date.now();
  if (players.length >= 2) {
    const sorted = [...players].sort((a, b) => a.queuedAt - b.queuedAt);
    for (const caller of sorted) {
      const candidates = players.filter((p) => p.playerId !== caller.playerId);
      let bestNonRecent;
      let bestRecent;
      for (const candidate of candidates) {
        if (await isRecentMatch(redis2, caller.playerId, candidate.playerId)) {
          if (!bestRecent) {
            bestRecent = candidate.playerId;
          }
        } else {
          bestNonRecent = candidate.playerId;
          break;
        }
      }
      let chosen;
      if (bestNonRecent) {
        chosen = bestNonRecent;
      } else if (bestRecent && now - caller.queuedAt >= RECENT_RETRY_MS) {
        chosen = bestRecent;
      }
      if (chosen) {
        await redis2.zRem(QUEUE_KEY, [caller.playerId, chosen]);
        const lobbyCode = await createLobby(redis2);
        const rKey = recentKey(caller.playerId, chosen);
        await redis2.set(rKey, "1");
        await redis2.expire(rKey, RECENT_TTL_SECONDS);
        await redis2.set(matchedKey(caller.playerId), lobbyCode);
        await redis2.expire(matchedKey(caller.playerId), MATCHED_TTL_SECONDS);
        await redis2.set(matchedKey(chosen), lobbyCode);
        await redis2.expire(matchedKey(chosen), MATCHED_TTL_SECONDS);
        return { matched: true, lobbyCode };
      }
    }
  }
  if (options?.allowBotFallback && players.length === 1) {
    const caller = players[0];
    if (now - caller.queuedAt >= QUEUE_TIMEOUT_MS) {
      await redis2.zRem(QUEUE_KEY, [caller.playerId]);
      const lobbyCode = await createLobby(redis2, { bot: true });
      await redis2.set(matchedKey(caller.playerId), lobbyCode);
      await redis2.expire(matchedKey(caller.playerId), MATCHED_TTL_SECONDS);
      return { matched: true, lobbyCode, bot: true };
    }
  }
  return { matched: false };
}
async function handleQueueJoin(redis2, playerId) {
  const existing = await redis2.zRange(QUEUE_KEY, 0, -1, { by: "rank" });
  const alreadyQueued = existing.some((entry) => entry.member === playerId);
  if (!alreadyQueued) {
    await redis2.zAdd(QUEUE_KEY, { member: playerId, score: Date.now() });
  }
  const result = await tryMatchQueue(redis2, { allowBotFallback: true });
  if (result.matched && result.lobbyCode) {
    return { status: "matched", lobbyCode: result.lobbyCode, bot: result.bot };
  }
  return { status: "waiting" };
}
async function handleQueueStatus(redis2, playerId) {
  const lobbyCode = await redis2.get(matchedKey(playerId));
  if (lobbyCode) {
    const meta = await redis2.get(`ab:lobby:${lobbyCode}:meta`);
    if (meta) {
      const parsed = JSON.parse(meta);
      return { status: "matched", lobbyCode, bot: Boolean(parsed.bot) };
    }
  }
  return { status: "waiting" };
}

// src/devvit/server.ts
var LOBBY_PREFIX = "ab:lobby";
var LOG_MAX_LENGTH = 256;
var HEARTBEAT_TIMEOUT_MS = 1e4;
var PLAYER_TTL_SECONDS = 3600;
function lobbyMetaKey(code) {
  return `${LOBBY_PREFIX}:${code}:meta`;
}
function lobbyPlayersKey(code) {
  return `${LOBBY_PREFIX}:${code}:players`;
}
function lobbyLogKey(code) {
  return `${LOBBY_PREFIX}:${code}:log`;
}
function lobbyCursorKey(code) {
  return `${LOBBY_PREFIX}:${code}:cursor`;
}
function lobbyLastSeenKey(code, peerId) {
  return `${LOBBY_PREFIX}:${code}:lastSeen:${peerId}`;
}
async function getLobbyMeta(code) {
  const raw = await redis.get(lobbyMetaKey(code));
  if (!raw) {
    return null;
  }
  return JSON.parse(raw);
}
async function setLobbyMeta(code, meta) {
  await redis.set(lobbyMetaKey(code), JSON.stringify(meta));
  await redis.expire(lobbyMetaKey(code), PLAYER_TTL_SECONDS);
}
async function getPlayers(code) {
  const raw = await redis.hGetAll(lobbyPlayersKey(code));
  if (!raw || Object.keys(raw).length === 0) {
    return [];
  }
  const players = [];
  for (const peerId of Object.keys(raw)) {
    players.push(JSON.parse(raw[peerId]));
  }
  return players;
}
async function setPlayer(code, player) {
  await redis.hSet(lobbyPlayersKey(code), { [player.peerId]: JSON.stringify(player) });
  await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
}
async function removePlayer(code, peerId) {
  await redis.hDel(lobbyPlayersKey(code), [peerId]);
  await redis.del(lobbyLastSeenKey(code, peerId));
  await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
}
async function appendMessage(code, from, message) {
  const cursorKey = lobbyCursorKey(code);
  let cursor = await redis.get(cursorKey);
  if (!cursor) {
    cursor = "0";
  }
  const nextCursor = Number(cursor) + 1;
  const entry = {
    cursor: String(nextCursor),
    from,
    message
  };
  await redis.zAdd(lobbyLogKey(code), { score: nextCursor, member: JSON.stringify(entry) });
  await redis.zRemRangeByRank(lobbyLogKey(code), 0, -LOG_MAX_LENGTH - 1);
  await redis.set(cursorKey, String(nextCursor));
  await redis.expire(lobbyLogKey(code), PLAYER_TTL_SECONDS);
  await redis.expire(cursorKey, PLAYER_TTL_SECONDS);
  return String(nextCursor);
}
async function getMessages(code, after) {
  const afterNum = Number(after) || 0;
  const raw = await redis.zRange(lobbyLogKey(code), afterNum + 1, "+inf", { by: "score" });
  if (!raw || raw.length === 0) {
    return [];
  }
  const entries = [];
  for (const item of raw) {
    const entry = JSON.parse(item.member);
    entries.push(entry);
  }
  return entries;
}
async function refreshTtl(code) {
  await redis.expire(lobbyMetaKey(code), PLAYER_TTL_SECONDS);
  await redis.expire(lobbyPlayersKey(code), PLAYER_TTL_SECONDS);
  await redis.expire(lobbyLogKey(code), PLAYER_TTL_SECONDS);
  await redis.expire(lobbyCursorKey(code), PLAYER_TTL_SECONDS);
}
async function isPlayerStale(code, peerId) {
  const lastSeenRaw = await redis.get(lobbyLastSeenKey(code, peerId));
  if (!lastSeenRaw) {
    return true;
  }
  const lastSeen = Number(lastSeenRaw);
  return Date.now() - lastSeen > HEARTBEAT_TIMEOUT_MS;
}
async function markPlayerSeen(code, peerId) {
  await redis.set(lobbyLastSeenKey(code, peerId), String(Date.now()));
  await redis.expire(lobbyLastSeenKey(code, peerId), PLAYER_TTL_SECONDS);
}
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const body = Buffer.concat(chunks).toString("utf-8");
  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}
var server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }
  try {
    if (url.pathname === "/api/lobby" && req.method === "POST") {
      const body = await readJsonBody(req);
      const code = String(body.code || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "") || crypto.randomUUID().slice(0, 8).toUpperCase();
      const meta = {
        code,
        config: {},
        status: "waiting",
        hostPeerId: "",
        createdAt: Date.now()
      };
      await setLobbyMeta(code, meta);
      res.writeHead(200);
      res.end(JSON.stringify({ code }));
      return;
    }
    const lobbyMatch = url.pathname.match(/^\/api\/lobby\/([^/]+)\/?$/);
    if (lobbyMatch && req.method === "POST") {
      const code = lobbyMatch[1];
      const body = await readJsonBody(req);
      const meta = await getLobbyMeta(code);
      if (!meta) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Lobby not found" }));
        return;
      }
      const myId = crypto.randomUUID();
      const players = await getPlayers(code);
      let playerIndex = -1;
      if (body.isHost) {
        meta.hostPeerId = myId;
        playerIndex = 0;
        await setLobbyMeta(code, meta);
      } else {
        const usedIndexes = new Set(players.map((p) => p.playerIndex));
        for (let i = 1; i < 8; i += 1) {
          if (!usedIndexes.has(i)) {
            playerIndex = i;
            break;
          }
        }
      }
      const player = {
        peerId: myId,
        playerId: myId,
        name: String(body.name || myId),
        playerIndex,
        lastSeen: Date.now()
      };
      await setPlayer(code, player);
      await markPlayerSeen(code, myId);
      await refreshTtl(code);
      if (meta.bot) {
        const currentPlayers = await getPlayers(code);
        const realPlayers = currentPlayers.filter((p) => !p.playerId.startsWith("bot-"));
        if (realPlayers.length === 1) {
          const botPlayerId = `bot-${code}`;
          const botPeerId = `bot-${code}`;
          const usedIndexes = new Set(currentPlayers.map((p) => p.playerIndex));
          let botPlayerIndex = -1;
          for (let i = 1; i < 8; i += 1) {
            if (!usedIndexes.has(i)) {
              botPlayerIndex = i;
              break;
            }
          }
          const botPlayer = {
            peerId: botPeerId,
            playerId: botPlayerId,
            name: "CPU",
            playerIndex: botPlayerIndex,
            lastSeen: Date.now()
          };
          await setPlayer(code, botPlayer);
          await appendMessage(code, botPeerId, {
            type: "player-joined",
            player: {
              playerId: botPlayer.playerId,
              peerId: botPlayer.peerId,
              name: botPlayer.name,
              playerIndex: botPlayer.playerIndex
            }
          });
        }
      }
      await appendMessage(code, myId, {
        type: "player-joined",
        player: {
          playerId: player.playerId,
          peerId: player.peerId,
          name: player.name,
          playerIndex: player.playerIndex
        }
      });
      res.writeHead(200);
      res.end(JSON.stringify({ myId, playerIndex, isHost: Boolean(body.isHost) }));
      return;
    }
    if (url.pathname.startsWith("/api/lobby/") && req.method === "POST") {
      const parts = url.pathname.split("/");
      const code = parts[3];
      const action = parts[4];
      if (action === "message") {
        const body = await readJsonBody(req);
        const from = String(body.playerId || "unknown");
        const meta = await getLobbyMeta(code);
        if (!meta) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Lobby not found" }));
          return;
        }
        const cursor = await appendMessage(code, from, body.message);
        await markPlayerSeen(code, from);
        await refreshTtl(code);
        res.writeHead(200);
        res.end(JSON.stringify({ cursor }));
        return;
      }
      if (action === "start") {
        const meta = await getLobbyMeta(code);
        if (!meta) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Lobby not found" }));
          return;
        }
        meta.status = "playing";
        await setLobbyMeta(code, meta);
        const players = await getPlayers(code);
        await appendMessage(code, meta.hostPeerId, {
          type: "match-start",
          config: meta.config,
          players: players.map((p) => ({
            playerId: p.playerId,
            peerId: p.peerId,
            name: p.name,
            playerIndex: p.playerIndex,
            isBot: p.playerId.startsWith("bot-")
          })),
          host: meta.hostPeerId,
          hostPeerId: meta.hostPeerId
        });
        await refreshTtl(code);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return;
      }
      if (action === "leave") {
        const body = await readJsonBody(req);
        const from = String(body.playerId || "unknown");
        await removePlayer(code, from);
        const players = await getPlayers(code);
        if (players.length === 0) {
          await redis.del(lobbyMetaKey(code));
          await redis.del(lobbyPlayersKey(code));
          await redis.del(lobbyLogKey(code));
          await redis.del(lobbyCursorKey(code));
        } else {
          await appendMessage(code, from, {
            type: "player-left",
            playerId: from,
            player: {
              playerId: from,
              peerId: from,
              name: from,
              playerIndex: -1
            }
          });
        }
        await refreshTtl(code);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
        return;
      }
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    if (url.pathname.startsWith("/api/lobby/") && req.method === "GET") {
      const parts = url.pathname.split("/");
      const code = parts[3];
      const action = parts[4];
      if (action === "messages") {
        const after = url.searchParams.get("after") || "0";
        const playerId = url.searchParams.get("playerId");
        if (playerId) {
          await markPlayerSeen(code, playerId);
        }
        const entries = await getMessages(code, after);
        res.writeHead(200);
        res.end(JSON.stringify(entries));
        return;
      }
      if (action === "state") {
        const playerId = url.searchParams.get("playerId");
        if (playerId) {
          await markPlayerSeen(code, playerId);
        }
        const meta = await getLobbyMeta(code);
        if (!meta) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Lobby not found" }));
          return;
        }
        let players = await getPlayers(code);
        const activePlayers = [];
        for (const player of players) {
          if (!await isPlayerStale(code, player.peerId)) {
            activePlayers.push(player);
          }
        }
        if (activePlayers.length !== players.length) {
          for (const stale of players) {
            if (activePlayers.find((p) => p.peerId === stale.peerId)) {
              continue;
            }
            await removePlayer(code, stale.peerId);
          }
          players = activePlayers;
        }
        await refreshTtl(code);
        res.writeHead(200);
        res.end(
          JSON.stringify({
            players: players.map((p) => ({
              peerId: p.peerId,
              playerId: p.playerId,
              name: p.name,
              playerIndex: p.playerIndex
            })),
            config: meta.config,
            status: meta.status,
            host: meta.hostPeerId,
            hostPlayerId: meta.hostPeerId
          })
        );
        return;
      }
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    if (url.pathname === "/internal/queue/join" && req.method === "POST") {
      const body = await readJsonBody(req);
      const playerId = String(body.playerId || "");
      if (!playerId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "playerId is required" }));
        return;
      }
      const result = await handleQueueJoin(redis, playerId);
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }
    if (url.pathname === "/api/queue/status" && req.method === "GET") {
      const playerId = url.searchParams.get("playerId") || "";
      if (!playerId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "playerId is required" }));
        return;
      }
      const result = await handleQueueStatus(redis, playerId);
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});
server.listen(getServerPort(), () => {
  console.log(`Devvit server listening on port ${getServerPort()}`);
});
/*! Bundled license information:

long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)

long/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
