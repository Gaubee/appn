import { r, _ as __esDecorate, t, i, b as __runInitializers } from './custom-element-T1yNbIOj.js';
import { n } from './property-CF65yZga.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { z, N } from './index-Ccu0cnQI.js';
import './decorators-D_q1KxA8.js';
import { a as func_lazy } from './func-Sj6vdvUs.js';

/**
 * Clamps a value between a lower and an upper bound (inclusive).
 */
const math_clamp = (value, lower, upper) => {
    return Math.min(upper, Math.max(lower, value));
};

/*
 *  big.js v6.2.2
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2024 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */


/************************************** EDITABLE DEFAULTS *****************************************/


  // The default values below must be integers within the stated ranges.

  /*
   * The maximum number of decimal places (DP) of the results of operations involving division:
   * div and sqrt, and pow with negative exponents.
   */
var DP = 20,          // 0 to MAX_DP

  /*
   * The rounding mode (RM) used when rounding to the above decimal places.
   *
   *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
   *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
   *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
   *  3  Away from zero.                                  (ROUND_UP)
   */
  RM = 1,             // 0, 1, 2 or 3

  // The maximum value of DP and Big.DP.
  MAX_DP = 1E6,       // 0 to 1000000

  // The maximum magnitude of the exponent argument to the pow method.
  MAX_POWER = 1E6,    // 1 to 1000000

  /*
   * The negative exponent (NE) at and beneath which toString returns exponential notation.
   * (JavaScript numbers: -7)
   * -1000000 is the minimum recommended exponent value of a Big.
   */
  NE = -7,            // 0 to -1000000

  /*
   * The positive exponent (PE) at and above which toString returns exponential notation.
   * (JavaScript numbers: 21)
   * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
   */
  PE = 21,            // 0 to 1000000

  /*
   * When true, an error will be thrown if a primitive number is passed to the Big constructor,
   * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
   * primitive number without a loss of precision.
   */
  STRICT = false,     // true or false


/**************************************************************************************************/


  // Error messages.
  NAME = '[big.js] ',
  INVALID = NAME + 'Invalid ',
  INVALID_DP = INVALID + 'decimal places',
  INVALID_RM = INVALID + 'rounding mode',
  DIV_BY_ZERO = NAME + 'Division by zero',

  // The shared prototype object.
  P = {},
  UNDEFINED = void 0,
  NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


/*
 * Create and return a Big constructor.
 */
function _Big_() {

  /*
   * The Big constructor and exported function.
   * Create and return a new instance of a Big number object.
   *
   * n {number|string|Big} A numeric value.
   */
  function Big(n) {
    var x = this;

    // Enable constructor usage without new.
    if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

    // Duplicate.
    if (n instanceof Big) {
      x.s = n.s;
      x.e = n.e;
      x.c = n.c.slice();
    } else {
      if (typeof n !== 'string') {
        if (Big.strict === true && typeof n !== 'bigint') {
          throw TypeError(INVALID + 'value');
        }

        // Minus zero?
        n = n === 0 && 1 / n < 0 ? '-0' : String(n);
      }

      parse$1(x, n);
    }

    // Retain a reference to this Big constructor.
    // Shadow Big.prototype.constructor which points to Object.
    x.constructor = Big;
  }

  Big.prototype = P;
  Big.DP = DP;
  Big.RM = RM;
  Big.NE = NE;
  Big.PE = PE;
  Big.strict = STRICT;
  Big.roundDown = 0;
  Big.roundHalfUp = 1;
  Big.roundHalfEven = 2;
  Big.roundUp = 3;

  return Big;
}


/*
 * Parse the number or string value passed to a Big constructor.
 *
 * x {Big} A Big number instance.
 * n {number|string} A numeric value.
 */
function parse$1(x, n) {
  var e, i, nl;

  if (!NUMERIC.test(n)) {
    throw Error(INVALID + 'number');
  }

  // Determine sign.
  x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

  // Decimal point?
  if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

  // Exponential form?
  if ((i = n.search(/e/i)) > 0) {

    // Determine exponent.
    if (e < 0) e = i;
    e += +n.slice(i + 1);
    n = n.substring(0, i);
  } else if (e < 0) {

    // Integer.
    e = n.length;
  }

  nl = n.length;

  // Determine leading zeros.
  for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

  if (i == nl) {

    // Zero.
    x.c = [x.e = 0];
  } else {

    // Determine trailing zeros.
    for (; nl > 0 && n.charAt(--nl) == '0';);
    x.e = e - i - 1;
    x.c = [];

    // Convert string to array of digits without leading/trailing zeros.
    for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
  }

  return x;
}


/*
 * Round Big x to a maximum of sd significant digits using rounding mode rm.
 *
 * x {Big} The Big to round.
 * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
 * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 * [more] {boolean} Whether the result of division was truncated.
 */
function round(x, sd, rm, more) {
  var xc = x.c;

  if (rm === UNDEFINED) rm = x.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }

  if (sd < 1) {
    more =
      rm === 3 && (more || !!xc[0]) || sd === 0 && (
      rm === 1 && xc[0] >= 5 ||
      rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
    );

    xc.length = 1;

    if (more) {

      // 1, 0.1, 0.01, 0.001, 0.0001 etc.
      x.e = x.e - sd + 1;
      xc[0] = 1;
    } else {

      // Zero.
      xc[0] = x.e = 0;
    }
  } else if (sd < xc.length) {

    // xc[sd] is the digit after the digit that may be rounded up.
    more =
      rm === 1 && xc[sd] >= 5 ||
      rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
        (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
      rm === 3 && (more || !!xc[0]);

    // Remove any digits after the required precision.
    xc.length = sd;

    // Round up?
    if (more) {

      // Rounding up may mean the previous digit has to be rounded up.
      for (; ++xc[--sd] > 9;) {
        xc[sd] = 0;
        if (sd === 0) {
          ++x.e;
          xc.unshift(1);
          break;
        }
      }
    }

    // Remove trailing zeros.
    for (sd = xc.length; !xc[--sd];) xc.pop();
  }

  return x;
}


/*
 * Return a string representing the value of Big x in normal or exponential notation.
 * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
 */
function stringify(x, doExponential, isNonzero) {
  var e = x.e,
    s = x.c.join(''),
    n = s.length;

  // Exponential notation?
  if (doExponential) {
    s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

  // Normal notation.
  } else if (e < 0) {
    for (; ++e;) s = '0' + s;
    s = '0.' + s;
  } else if (e > 0) {
    if (++e > n) {
      for (e -= n; e--;) s += '0';
    } else if (e < n) {
      s = s.slice(0, e) + '.' + s.slice(e);
    }
  } else if (n > 1) {
    s = s.charAt(0) + '.' + s.slice(1);
  }

  return x.s < 0 && isNonzero ? '-' + s : s;
}


// Prototype/instance methods


/*
 * Return a new Big whose value is the absolute value of this Big.
 */
P.abs = function () {
  var x = new this.constructor(this);
  x.s = 1;
  return x;
};


/*
 * Return 1 if the value of this Big is greater than the value of Big y,
 *       -1 if the value of this Big is less than the value of Big y, or
 *        0 if they have the same value.
 */
P.cmp = function (y) {
  var isneg,
    x = this,
    xc = x.c,
    yc = (y = new x.constructor(y)).c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;

  isneg = i < 0;

  // Compare exponents.
  if (k != l) return k > l ^ isneg ? 1 : -1;

  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = -1; ++i < j;) {
    if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
  }

  // Compare lengths.
  return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};


/*
 * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
 * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.div = function (y) {
  var x = this,
    Big = x.constructor,
    a = x.c,                  // dividend
    b = (y = new Big(y)).c,   // divisor
    k = x.s == y.s ? 1 : -1,
    dp = Big.DP;

  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }

  // Divisor is zero?
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }

  // Dividend is 0? Return +-0.
  if (!a[0]) {
    y.s = k;
    y.c = [y.e = 0];
    return y;
  }

  var bl, bt, n, cmp, ri,
    bz = b.slice(),
    ai = bl = b.length,
    al = a.length,
    r = a.slice(0, bl),   // remainder
    rl = r.length,
    q = y,                // quotient
    qc = q.c = [],
    qi = 0,
    p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

  q.s = k;
  k = p < 0 ? 0 : p;

  // Create version of divisor with leading zero.
  bz.unshift(0);

  // Add zeros to make remainder as long as divisor.
  for (; rl++ < bl;) r.push(0);

  do {

    // n is how many times the divisor goes into current remainder.
    for (n = 0; n < 10; n++) {

      // Compare divisor and remainder.
      if (bl != (rl = r.length)) {
        cmp = bl > rl ? 1 : -1;
      } else {
        for (ri = -1, cmp = 0; ++ri < bl;) {
          if (b[ri] != r[ri]) {
            cmp = b[ri] > r[ri] ? 1 : -1;
            break;
          }
        }
      }

      // If divisor < remainder, subtract divisor from remainder.
      if (cmp < 0) {

        // Remainder can't be more than 1 digit longer than divisor.
        // Equalise lengths using divisor with extra leading zero?
        for (bt = rl == bl ? b : bz; rl;) {
          if (r[--rl] < bt[rl]) {
            ri = rl;
            for (; ri && !r[--ri];) r[ri] = 9;
            --r[ri];
            r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }

        for (; !r[0];) r.shift();
      } else {
        break;
      }
    }

    // Add the digit n to the result array.
    qc[qi++] = cmp ? n : ++n;

    // Update the remainder.
    if (r[0] && cmp) r[rl] = a[ai] || 0;
    else r = [a[ai]];

  } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

  // Leading zero? Do not remove if result is simply zero (qi == 1).
  if (!qc[0] && qi != 1) {

    // There can't be more than one zero.
    qc.shift();
    q.e--;
    p--;
  }

  // Round?
  if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

  return q;
};


/*
 * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
 */
P.eq = function (y) {
  return this.cmp(y) === 0;
};


/*
 * Return true if the value of this Big is greater than the value of Big y, otherwise return
 * false.
 */
P.gt = function (y) {
  return this.cmp(y) > 0;
};


/*
 * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
 * return false.
 */
P.gte = function (y) {
  return this.cmp(y) > -1;
};


/*
 * Return true if the value of this Big is less than the value of Big y, otherwise return false.
 */
P.lt = function (y) {
  return this.cmp(y) < 0;
};


/*
 * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
 * return false.
 */
P.lte = function (y) {
  return this.cmp(y) < 1;
};


/*
 * Return a new Big whose value is the value of this Big minus the value of Big y.
 */
P.minus = P.sub = function (y) {
  var i, j, t, xlty,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;

  // Signs differ?
  if (a != b) {
    y.s = -b;
    return x.plus(y);
  }

  var xc = x.c.slice(),
    xe = x.e,
    yc = y.c,
    ye = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (yc[0]) {
      y.s = -b;
    } else if (xc[0]) {
      y = new Big(x);
    } else {
      y.s = 1;
    }
    return y;
  }

  // Determine which is the bigger number. Prepend zeros to equalise exponents.
  if (a = xe - ye) {

    if (xlty = a < 0) {
      a = -a;
      t = xc;
    } else {
      ye = xe;
      t = yc;
    }

    t.reverse();
    for (b = a; b--;) t.push(0);
    t.reverse();
  } else {

    // Exponents equal. Check digit by digit.
    j = ((xlty = xc.length < yc.length) ? xc : yc).length;

    for (a = b = 0; b < j; b++) {
      if (xc[b] != yc[b]) {
        xlty = xc[b] < yc[b];
        break;
      }
    }
  }

  // x < y? Point xc to the array of the bigger number.
  if (xlty) {
    t = xc;
    xc = yc;
    yc = t;
    y.s = -y.s;
  }

  /*
   * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
   * needs to start at yc.length.
   */
  if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

  // Subtract yc from xc.
  for (b = i; j > a;) {
    if (xc[--j] < yc[j]) {
      for (i = j; i && !xc[--i];) xc[i] = 9;
      --xc[i];
      xc[j] += 10;
    }

    xc[j] -= yc[j];
  }

  // Remove trailing zeros.
  for (; xc[--b] === 0;) xc.pop();

  // Remove leading zeros and adjust exponent accordingly.
  for (; xc[0] === 0;) {
    xc.shift();
    --ye;
  }

  if (!xc[0]) {

    // n - n = +0
    y.s = 1;

    // Result must be zero.
    xc = [ye = 0];
  }

  y.c = xc;
  y.e = ye;

  return y;
};


/*
 * Return a new Big whose value is the value of this Big modulo the value of Big y.
 */
P.mod = function (y) {
  var ygtx,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;

  if (!y.c[0]) {
    throw Error(DIV_BY_ZERO);
  }

  x.s = y.s = 1;
  ygtx = y.cmp(x) == 1;
  x.s = a;
  y.s = b;

  if (ygtx) return new Big(x);

  a = Big.DP;
  b = Big.RM;
  Big.DP = Big.RM = 0;
  x = x.div(y);
  Big.DP = a;
  Big.RM = b;

  return this.minus(x.times(y));
};


/*
 * Return a new Big whose value is the value of this Big negated.
 */
P.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return x;
};


/*
 * Return a new Big whose value is the value of this Big plus the value of Big y.
 */
P.plus = P.add = function (y) {
  var e, k, t,
    x = this,
    Big = x.constructor;

  y = new Big(y);

  // Signs differ?
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }

  var xe = x.e,
    xc = x.c,
    ye = y.e,
    yc = y.c;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (!yc[0]) {
      if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = x.s;
      }
    }
    return y;
  }

  xc = xc.slice();

  // Prepend zeros to equalise exponents.
  // Note: reverse faster than unshifts.
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t = yc;
    } else {
      e = -e;
      t = xc;
    }

    t.reverse();
    for (; e--;) t.push(0);
    t.reverse();
  }

  // Point xc to the longer array.
  if (xc.length - yc.length < 0) {
    t = yc;
    yc = xc;
    xc = t;
  }

  e = yc.length;

  // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
  for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

  // No need to check for zero, as +x + +y != 0 && -x + -y != 0

  if (k) {
    xc.unshift(k);
    ++ye;
  }

  // Remove trailing zeros.
  for (e = xc.length; xc[--e] === 0;) xc.pop();

  y.c = xc;
  y.e = ye;

  return y;
};


/*
 * Return a Big whose value is the value of this Big raised to the power n.
 * If n is negative, round to a maximum of Big.DP decimal places using rounding
 * mode Big.RM.
 *
 * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
 */
P.pow = function (n) {
  var x = this,
    one = new x.constructor('1'),
    y = one,
    isneg = n < 0;

  if (n !== ~~n || n < -1e6 || n > MAX_POWER) {
    throw Error(INVALID + 'exponent');
  }

  if (isneg) n = -n;

  for (;;) {
    if (n & 1) y = y.times(x);
    n >>= 1;
    if (!n) break;
    x = x.times(x);
  }

  return isneg ? one.div(y) : y;
};


/*
 * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
 * significant digits using rounding mode rm, or Big.RM if rm is not specified.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.prec = function (sd, rm) {
  if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
    throw Error(INVALID + 'precision');
  }
  return round(new this.constructor(this), sd, rm);
};


/*
 * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
 * using rounding mode rm, or Big.RM if rm is not specified.
 * If dp is negative, round to an integer which is a multiple of 10**-dp.
 * If dp is not specified, round to 0 decimal places.
 *
 * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.round = function (dp, rm) {
  if (dp === UNDEFINED) dp = 0;
  else if (dp !== ~~dp || dp < -1e6 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round(new this.constructor(this), dp + this.e + 1, rm);
};


/*
 * Return a new Big whose value is the square root of the value of this Big, rounded, if
 * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.sqrt = function () {
  var r, c, t,
    x = this,
    Big = x.constructor,
    s = x.s,
    e = x.e,
    half = new Big('0.5');

  // Zero?
  if (!x.c[0]) return new Big(x);

  // Negative?
  if (s < 0) {
    throw Error(NAME + 'No square root');
  }

  // Estimate.
  s = Math.sqrt(+stringify(x, true, true));

  // Math.sqrt underflow/overflow?
  // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
  if (s === 0 || s === 1 / 0) {
    c = x.c.join('');
    if (!(c.length + e & 1)) c += '0';
    s = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
  } else {
    r = new Big(s + '');
  }

  e = r.e + (Big.DP += 4);

  // Newton-Raphson iteration.
  do {
    t = r;
    r = half.times(t.plus(x.div(t)));
  } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

  return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
};


/*
 * Return a new Big whose value is the value of this Big times the value of Big y.
 */
P.times = P.mul = function (y) {
  var c,
    x = this,
    Big = x.constructor,
    xc = x.c,
    yc = (y = new Big(y)).c,
    a = xc.length,
    b = yc.length,
    i = x.e,
    j = y.e;

  // Determine sign of result.
  y.s = x.s == y.s ? 1 : -1;

  // Return signed 0 if either 0.
  if (!xc[0] || !yc[0]) {
    y.c = [y.e = 0];
    return y;
  }

  // Initialise exponent of result as x.e + y.e.
  y.e = i + j;

  // If array xc has fewer digits than yc, swap xc and yc, and lengths.
  if (a < b) {
    c = xc;
    xc = yc;
    yc = c;
    j = a;
    a = b;
    b = j;
  }

  // Initialise coefficient array of result with zeros.
  for (c = new Array(j = a + b); j--;) c[j] = 0;

  // Multiply.

  // i is initially xc.length.
  for (i = b; i--;) {
    b = 0;

    // a is yc.length.
    for (j = a + i; j > i;) {

      // Current sum of products at this digit position, plus carry.
      b = c[j] + yc[i] * xc[j - i - 1] + b;
      c[j--] = b % 10;

      // carry
      b = b / 10 | 0;
    }

    c[j] = b;
  }

  // Increment result exponent if there is a final carry, otherwise remove leading zero.
  if (b) ++y.e;
  else c.shift();

  // Remove trailing zeros.
  for (i = c.length; !c[--i];) c.pop();
  y.c = c;

  return y;
};


/*
 * Return a string representing the value of this Big in exponential notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.toExponential = function (dp, rm) {
  var x = this,
    n = x.c[0];

  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), ++dp, rm);
    for (; x.c.length < dp;) x.c.push(0);
  }

  return stringify(x, true, !!n);
};


/*
 * Return a string representing the value of this Big in normal notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 */
P.toFixed = function (dp, rm) {
  var x = this,
    n = x.c[0];

  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), dp + x.e + 1, rm);

    // x.e may have changed if the value is rounded up.
    for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
  }

  return stringify(x, false, !!n);
};


/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Omit the sign for negative zero.
 */
P[Symbol.for('nodejs.util.inspect.custom')] = P.toJSON = P.toString = function () {
  var x = this,
    Big = x.constructor;
  return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
};


/*
 * Return the value of this Big as a primitve number.
 */
P.toNumber = function () {
  var n = +stringify(this, true, true);
  if (this.constructor.strict === true && !this.eq(n.toString())) {
    throw Error(NAME + 'Imprecise conversion');
  }
  return n;
};


/*
 * Return a string representing the value of this Big rounded to sd significant digits using
 * rounding mode rm, or Big.RM if rm is not specified.
 * Use exponential notation if sd is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.toPrecision = function (sd, rm) {
  var x = this,
    Big = x.constructor,
    n = x.c[0];

  if (sd !== UNDEFINED) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    x = round(new Big(x), sd, rm);
    for (; x.c.length < sd;) x.c.push(0);
  }

  return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
};


/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Include the sign for negative zero.
 */
P.valueOf = function () {
  var x = this,
    Big = x.constructor;
  if (Big.strict === true) {
    throw Error(NAME + 'valueOf disallowed');
  }
  return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
};


// Export


var Big = _Big_();

/**
 * Configuration options for the rangeToSafeConverter function.
 */
function normalizeStep(stepParam) {
    if (stepParam === undefined) {
        return undefined;
    }
    if (typeof stepParam === 'number') {
        if (stepParam <= 0) {
            throw new Error(`Invalid step value: ${stepParam}. Step number must be greater than 0.`);
        }
        return { type: 'exact', unit: stepParam };
    }
    if (typeof stepParam === 'function') {
        return { type: 'function', fn: stepParam };
    }
    if (typeof stepParam === 'object' && stepParam !== null && 'mode' in stepParam && 'unit' in stepParam) {
        if (stepParam.unit <= 0) {
            throw new Error(`Invalid step unit: ${stepParam.unit}. Step unit must be greater than 0.`);
        }
        return { type: 'mode', mode: stepParam.mode, unit: stepParam.unit };
    }
    throw new Error(`Invalid step configuration: ${JSON.stringify(stepParam)}`);
}
/**
 * 数字范围转换器，用于将数值范围限制在给定的最小值和最大值之间，并使用指定的步长进行整数化。
 */
/*@__NO_SIDE_EFFECTS__*/
const _rangeToSafeConverter = (min, max, options = {}) => {
    if (min > max) {
        throw new Error(`Invalid range: min (${min}) must be less than or equal to max (${max}).`);
    }
    const normalizedStep = normalizeStep(options.step);
    const { nullable, numberify = Number, stringify = String } = options;
    // Calculate and validate default value
    const providedOrDefault = options.defaultValue === undefined ? min : options.defaultValue;
    let defaultValue = nullable && providedOrDefault === null ? null : typeof providedOrDefault === 'number' ? providedOrDefault : min;
    // Final validation of default value
    if (defaultValue !== null && (defaultValue < min || defaultValue > max)) {
        const resetDefaultValue = defaultValue < min ? min : max;
        console.warn(`Default value (${defaultValue}) is outside the range [${min}, ${max}]. Using ${resetDefaultValue} as default.`);
        defaultValue = resetDefaultValue;
    }
    // Create context once for step functions
    const ctx = Object.freeze({
        min,
        max,
        nullable,
        defaultValue,
    });
    /**
     * 使用 js 进行数学会导致精度问题，比如 Math.floor(0.3/0.1) = 2.9999999999999996 => Math.floor(2.9999999999999996) = 2
     * 因此这里统一通过引入 big.js 来计算，避免出现精度问题
     */
    const applyStepping = z(normalizedStep)
        .with(N.nullish, () => (value) => value)
        .with({ type: 'exact' }, { type: 'mode', mode: 'floor' }, ({ unit }) => (value) => {
        return new Big(value).div(unit).round(0, Big.roundDown).times(unit).toNumber();
    })
        .with({ type: 'mode', mode: 'ceil' }, ({ unit }) => (value) => {
        return new Big(value).div(unit).round(0, Big.roundUp).times(unit).toNumber();
    })
        .with({ type: 'mode', mode: 'round' }, ({ unit }) => (value) => {
        return new Big(value).div(unit).round(0, Big.roundHalfUp).times(unit).toNumber();
    })
        .with({ type: 'function' }, ({ fn }) => (value) => {
        return fn(value, ctx);
    })
        .exhaustive();
    /**
     * Processes a value through stepping, validation, and clamping
     */
    const processValue = (value) => {
        // Apply stepping
        const steppedValue = applyStepping(value);
        // Handle undefined (step mismatch)
        // Handle null/undefined result from stepping function
        if (steppedValue == null) {
            if (nullable) {
                return null;
            }
            console.warn(`Stepping resulted in value: ${steppedValue}. Using default: ${defaultValue}.`);
            return defaultValue;
        }
        // Handle invalid number
        if (!Number.isFinite(steppedValue)) {
            console.warn(`Stepping resulted in invalid number: ${steppedValue}. Using default: ${defaultValue}.`);
            return defaultValue;
        }
        // Clamp value to range
        const clampedValue = Math.max(min, Math.min(steppedValue, max));
        // Return with warning if clamping occurred
        if (clampedValue !== steppedValue) {
            console.warn(`Stepped value ${steppedValue} clamped to range [${min}, ${max}]. Result: ${clampedValue}.`);
        }
        return clampedValue;
    };
    return {
        setProperty(value) {
            // Handle null/undefined values
            if (nullable && value == null) {
                return null;
            }
            // Handle non-numeric values
            const valueOfNumber = typeof value === 'number' ? value : numberify(String(value));
            if (!Number.isFinite(valueOfNumber)) {
                console.warn(`Invalid input type for setProperty: ${typeof value}. Using default: ${defaultValue}`);
                return defaultValue;
            }
            // Process the value through stepping, validation, and clamping
            return processValue(valueOfNumber);
        },
        fromAttribute(attributeValue) {
            // Handle null values
            if (nullable && attributeValue == null) {
                return null;
            }
            if (attributeValue === null) {
                return defaultValue;
            }
            // Parse the attribute value
            const parsedValue = numberify(attributeValue);
            if (isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
                console.warn(`Invalid attribute value: "${attributeValue}". Cannot parse to number. Using default: ${defaultValue}`);
                return defaultValue;
            }
            // Process the parsed value
            return processValue(parsedValue);
        },
        toAttribute(propertyValue) {
            // Handle null values
            if (nullable && propertyValue == null) {
                return null;
            }
            // Validate the property value
            if (!Number.isFinite(propertyValue)) {
                console.warn(`Invalid property value type for toAttribute: ${typeof propertyValue}. Returning null.`);
                return null;
            }
            // Convert to string
            return propertyValue == null ? propertyValue : stringify(propertyValue);
        },
    };
};
const rangeToSafeConverter = _rangeToSafeConverter;
const percentageToSafeConverter = rangeToSafeConverter(0, 1, {
    nullable: true,
    numberify(value) {
        if (value.endsWith('%')) {
            return +value.slice(0, -1) / 100;
        }
        return +value;
    },
    stringify(value) {
        return `${value * 100}%`;
    },
});

const parseNumber = (color, len) => {
	if (typeof color !== 'number') return;

	// hex3: #c93 -> #cc9933
	if (len === 3) {
		return {
			mode: 'rgb',
			r: (((color >> 8) & 0xf) | ((color >> 4) & 0xf0)) / 255,
			g: (((color >> 4) & 0xf) | (color & 0xf0)) / 255,
			b: ((color & 0xf) | ((color << 4) & 0xf0)) / 255
		};
	}

	// hex4: #c931 -> #cc993311
	if (len === 4) {
		return {
			mode: 'rgb',
			r: (((color >> 12) & 0xf) | ((color >> 8) & 0xf0)) / 255,
			g: (((color >> 8) & 0xf) | ((color >> 4) & 0xf0)) / 255,
			b: (((color >> 4) & 0xf) | (color & 0xf0)) / 255,
			alpha: ((color & 0xf) | ((color << 4) & 0xf0)) / 255
		};
	}

	// hex6: #f0f1f2
	if (len === 6) {
		return {
			mode: 'rgb',
			r: ((color >> 16) & 0xff) / 255,
			g: ((color >> 8) & 0xff) / 255,
			b: (color & 0xff) / 255
		};
	}

	// hex8: #f0f1f2ff
	if (len === 8) {
		return {
			mode: 'rgb',
			r: ((color >> 24) & 0xff) / 255,
			g: ((color >> 16) & 0xff) / 255,
			b: ((color >> 8) & 0xff) / 255,
			alpha: (color & 0xff) / 255
		};
	}
};

const named = {
	aliceblue: 0xf0f8ff,
	antiquewhite: 0xfaebd7,
	aqua: 0x00ffff,
	aquamarine: 0x7fffd4,
	azure: 0xf0ffff,
	beige: 0xf5f5dc,
	bisque: 0xffe4c4,
	black: 0x000000,
	blanchedalmond: 0xffebcd,
	blue: 0x0000ff,
	blueviolet: 0x8a2be2,
	brown: 0xa52a2a,
	burlywood: 0xdeb887,
	cadetblue: 0x5f9ea0,
	chartreuse: 0x7fff00,
	chocolate: 0xd2691e,
	coral: 0xff7f50,
	cornflowerblue: 0x6495ed,
	cornsilk: 0xfff8dc,
	crimson: 0xdc143c,
	cyan: 0x00ffff,
	darkblue: 0x00008b,
	darkcyan: 0x008b8b,
	darkgoldenrod: 0xb8860b,
	darkgray: 0xa9a9a9,
	darkgreen: 0x006400,
	darkgrey: 0xa9a9a9,
	darkkhaki: 0xbdb76b,
	darkmagenta: 0x8b008b,
	darkolivegreen: 0x556b2f,
	darkorange: 0xff8c00,
	darkorchid: 0x9932cc,
	darkred: 0x8b0000,
	darksalmon: 0xe9967a,
	darkseagreen: 0x8fbc8f,
	darkslateblue: 0x483d8b,
	darkslategray: 0x2f4f4f,
	darkslategrey: 0x2f4f4f,
	darkturquoise: 0x00ced1,
	darkviolet: 0x9400d3,
	deeppink: 0xff1493,
	deepskyblue: 0x00bfff,
	dimgray: 0x696969,
	dimgrey: 0x696969,
	dodgerblue: 0x1e90ff,
	firebrick: 0xb22222,
	floralwhite: 0xfffaf0,
	forestgreen: 0x228b22,
	fuchsia: 0xff00ff,
	gainsboro: 0xdcdcdc,
	ghostwhite: 0xf8f8ff,
	gold: 0xffd700,
	goldenrod: 0xdaa520,
	gray: 0x808080,
	green: 0x008000,
	greenyellow: 0xadff2f,
	grey: 0x808080,
	honeydew: 0xf0fff0,
	hotpink: 0xff69b4,
	indianred: 0xcd5c5c,
	indigo: 0x4b0082,
	ivory: 0xfffff0,
	khaki: 0xf0e68c,
	lavender: 0xe6e6fa,
	lavenderblush: 0xfff0f5,
	lawngreen: 0x7cfc00,
	lemonchiffon: 0xfffacd,
	lightblue: 0xadd8e6,
	lightcoral: 0xf08080,
	lightcyan: 0xe0ffff,
	lightgoldenrodyellow: 0xfafad2,
	lightgray: 0xd3d3d3,
	lightgreen: 0x90ee90,
	lightgrey: 0xd3d3d3,
	lightpink: 0xffb6c1,
	lightsalmon: 0xffa07a,
	lightseagreen: 0x20b2aa,
	lightskyblue: 0x87cefa,
	lightslategray: 0x778899,
	lightslategrey: 0x778899,
	lightsteelblue: 0xb0c4de,
	lightyellow: 0xffffe0,
	lime: 0x00ff00,
	limegreen: 0x32cd32,
	linen: 0xfaf0e6,
	magenta: 0xff00ff,
	maroon: 0x800000,
	mediumaquamarine: 0x66cdaa,
	mediumblue: 0x0000cd,
	mediumorchid: 0xba55d3,
	mediumpurple: 0x9370db,
	mediumseagreen: 0x3cb371,
	mediumslateblue: 0x7b68ee,
	mediumspringgreen: 0x00fa9a,
	mediumturquoise: 0x48d1cc,
	mediumvioletred: 0xc71585,
	midnightblue: 0x191970,
	mintcream: 0xf5fffa,
	mistyrose: 0xffe4e1,
	moccasin: 0xffe4b5,
	navajowhite: 0xffdead,
	navy: 0x000080,
	oldlace: 0xfdf5e6,
	olive: 0x808000,
	olivedrab: 0x6b8e23,
	orange: 0xffa500,
	orangered: 0xff4500,
	orchid: 0xda70d6,
	palegoldenrod: 0xeee8aa,
	palegreen: 0x98fb98,
	paleturquoise: 0xafeeee,
	palevioletred: 0xdb7093,
	papayawhip: 0xffefd5,
	peachpuff: 0xffdab9,
	peru: 0xcd853f,
	pink: 0xffc0cb,
	plum: 0xdda0dd,
	powderblue: 0xb0e0e6,
	purple: 0x800080,

	// Added in CSS Colors Level 4:
	// https://drafts.csswg.org/css-color/#changes-from-3
	rebeccapurple: 0x663399,

	red: 0xff0000,
	rosybrown: 0xbc8f8f,
	royalblue: 0x4169e1,
	saddlebrown: 0x8b4513,
	salmon: 0xfa8072,
	sandybrown: 0xf4a460,
	seagreen: 0x2e8b57,
	seashell: 0xfff5ee,
	sienna: 0xa0522d,
	silver: 0xc0c0c0,
	skyblue: 0x87ceeb,
	slateblue: 0x6a5acd,
	slategray: 0x708090,
	slategrey: 0x708090,
	snow: 0xfffafa,
	springgreen: 0x00ff7f,
	steelblue: 0x4682b4,
	tan: 0xd2b48c,
	teal: 0x008080,
	thistle: 0xd8bfd8,
	tomato: 0xff6347,
	turquoise: 0x40e0d0,
	violet: 0xee82ee,
	wheat: 0xf5deb3,
	white: 0xffffff,
	whitesmoke: 0xf5f5f5,
	yellow: 0xffff00,
	yellowgreen: 0x9acd32
};

// Also supports the `transparent` color as defined in:
// https://drafts.csswg.org/css-color/#transparent-black
const parseNamed = color => {
	return parseNumber(named[color.toLowerCase()], 6);
};

const hex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;

const parseHex = color => {
	let match;
	// eslint-disable-next-line no-cond-assign
	return (match = color.match(hex))
		? parseNumber(parseInt(match[1], 16), match[1].length)
		: undefined;
};

/*
	Basic building blocks for color regexes
	---------------------------------------

	These regexes are expressed as strings
	to be interpolated in the color regexes.
 */

// <number>
const num$1 = '([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)';

// <percentage>
const per = `${num$1}%`;

// <number-percentage> (<alpha-value>)
const num_per = `(?:${num$1}%|${num$1})`;

// <hue>
const hue$1 = `(?:${num$1}(deg|grad|rad|turn)|${num$1})`;

const c = `\\s*,\\s*`; // comma

/*
	rgb() regular expressions for legacy format
	Reference: https://drafts.csswg.org/css-color/#rgb-functions
 */
const rgb_num_old = new RegExp(
	`^rgba?\\(\\s*${num$1}${c}${num$1}${c}${num$1}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
);

const rgb_per_old = new RegExp(
	`^rgba?\\(\\s*${per}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
);

const parseRgbLegacy = color => {
	let res = { mode: 'rgb' };
	let match;
	if ((match = color.match(rgb_num_old))) {
		if (match[1] !== undefined) {
			res.r = match[1] / 255;
		}
		if (match[2] !== undefined) {
			res.g = match[2] / 255;
		}
		if (match[3] !== undefined) {
			res.b = match[3] / 255;
		}
	} else if ((match = color.match(rgb_per_old))) {
		if (match[1] !== undefined) {
			res.r = match[1] / 100;
		}
		if (match[2] !== undefined) {
			res.g = match[2] / 100;
		}
		if (match[3] !== undefined) {
			res.b = match[3] / 100;
		}
	} else {
		return undefined;
	}

	if (match[4] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, match[4] / 100));
	} else if (match[5] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, +match[5]));
	}

	return res;
};

const prepare = (color, mode) =>
	color === undefined
		? undefined
		: typeof color !== 'object'
		? parse(color)
		: color.mode !== undefined
		? color
		: mode
		? { ...color, mode }
		: undefined;

const converter =
	(target_mode = 'rgb') =>
	color =>
		(color = prepare(color, target_mode)) !== undefined
			? // if the color's mode corresponds to our target mode
			  color.mode === target_mode
				? // then just return the color
				  color
				: // otherwise check to see if we have a dedicated
				// converter for the target mode
				converters[color.mode][target_mode]
				? // and return its result...
				  converters[color.mode][target_mode](color)
				: // ...otherwise pass through RGB as an intermediary step.
				// if the target mode is RGB...
				target_mode === 'rgb'
				? // just return the RGB
				  converters[color.mode].rgb(color)
				: // otherwise convert color.mode -> RGB -> target_mode
				  converters.rgb[target_mode](converters[color.mode].rgb(color))
			: undefined;

const converters = {};
const modes = {};

const parsers = [];
const colorProfiles = {};

const identity = v => v;

const useMode = definition => {
	converters[definition.mode] = {
		...converters[definition.mode],
		...definition.toMode
	};

	Object.keys(definition.fromMode || {}).forEach(k => {
		if (!converters[k]) {
			converters[k] = {};
		}
		converters[k][definition.mode] = definition.fromMode[k];
	});

	// Color space channel ranges
	if (!definition.ranges) {
		definition.ranges = {};
	}

	if (!definition.difference) {
		definition.difference = {};
	}

	definition.channels.forEach(channel => {
		// undefined channel ranges default to the [0, 1] interval
		if (definition.ranges[channel] === undefined) {
			definition.ranges[channel] = [0, 1];
		}

		if (!definition.interpolate[channel]) {
			throw new Error(`Missing interpolator for: ${channel}`);
		}

		if (typeof definition.interpolate[channel] === 'function') {
			definition.interpolate[channel] = {
				use: definition.interpolate[channel]
			};
		}

		if (!definition.interpolate[channel].fixup) {
			definition.interpolate[channel].fixup = identity;
		}
	});

	modes[definition.mode] = definition;
	(definition.parse || []).forEach(parser => {
		useParser(parser, definition.mode);
	});

	return converter(definition.mode);
};

const getMode = mode => modes[mode];

const useParser = (parser, mode) => {
	if (typeof parser === 'string') {
		if (!mode) {
			throw new Error(`'mode' required when 'parser' is a string`);
		}
		colorProfiles[parser] = mode;
	} else if (typeof parser === 'function') {
		if (parsers.indexOf(parser) < 0) {
			parsers.push(parser);
		}
	}
};

/* eslint-disable-next-line no-control-regex */
const IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;

/* eslint-disable-next-line no-control-regex */
const IdentCodePoint = /[^\x00-\x7F]|[-\w]/;

const Tok = {
	Function: 'function',
	Ident: 'ident',
	Number: 'number',
	Percentage: 'percentage',
	ParenClose: ')',
	None: 'none',
	Hue: 'hue',
	Alpha: 'alpha'
};

let _i = 0;

/*
	4.3.10. Check if three code points would start a number
	https://drafts.csswg.org/css-syntax/#starts-with-a-number
 */
function is_num(chars) {
	let ch = chars[_i];
	let ch1 = chars[_i + 1];
	if (ch === '-' || ch === '+') {
		return /\d/.test(ch1) || (ch1 === '.' && /\d/.test(chars[_i + 2]));
	}
	if (ch === '.') {
		return /\d/.test(ch1);
	}
	return /\d/.test(ch);
}

/*
	Check if the stream starts with an identifier.
 */

function is_ident(chars) {
	if (_i >= chars.length) {
		return false;
	}
	let ch = chars[_i];
	if (IdentStartCodePoint.test(ch)) {
		return true;
	}
	if (ch === '-') {
		if (chars.length - _i < 2) {
			return false;
		}
		let ch1 = chars[_i + 1];
		if (ch1 === '-' || IdentStartCodePoint.test(ch1)) {
			return true;
		}
		return false;
	}
	return false;
}

/*
	4.3.3. Consume a numeric token
	https://drafts.csswg.org/css-syntax/#consume-numeric-token
 */

const huenits = {
	deg: 1,
	rad: 180 / Math.PI,
	grad: 9 / 10,
	turn: 360
};

function num(chars) {
	let value = '';
	if (chars[_i] === '-' || chars[_i] === '+') {
		value += chars[_i++];
	}
	value += digits(chars);
	if (chars[_i] === '.' && /\d/.test(chars[_i + 1])) {
		value += chars[_i++] + digits(chars);
	}
	if (chars[_i] === 'e' || chars[_i] === 'E') {
		if (
			(chars[_i + 1] === '-' || chars[_i + 1] === '+') &&
			/\d/.test(chars[_i + 2])
		) {
			value += chars[_i++] + chars[_i++] + digits(chars);
		} else if (/\d/.test(chars[_i + 1])) {
			value += chars[_i++] + digits(chars);
		}
	}
	if (is_ident(chars)) {
		let id = ident(chars);
		if (id === 'deg' || id === 'rad' || id === 'turn' || id === 'grad') {
			return { type: Tok.Hue, value: value * huenits[id] };
		}
		return undefined;
	}
	if (chars[_i] === '%') {
		_i++;
		return { type: Tok.Percentage, value: +value };
	}
	return { type: Tok.Number, value: +value };
}

/*
	Consume digits.
 */
function digits(chars) {
	let v = '';
	while (/\d/.test(chars[_i])) {
		v += chars[_i++];
	}
	return v;
}

/*
	Consume an identifier.
 */
function ident(chars) {
	let v = '';
	while (_i < chars.length && IdentCodePoint.test(chars[_i])) {
		v += chars[_i++];
	}
	return v;
}

/*
	Consume an ident-like token.
 */
function identlike(chars) {
	let v = ident(chars);
	if (chars[_i] === '(') {
		_i++;
		return { type: Tok.Function, value: v };
	}
	if (v === 'none') {
		return { type: Tok.None, value: undefined };
	}
	return { type: Tok.Ident, value: v };
}

function tokenize(str = '') {
	let chars = str.trim();
	let tokens = [];
	let ch;

	/* reset counter */
	_i = 0;

	while (_i < chars.length) {
		ch = chars[_i++];

		/*
			Consume whitespace without emitting it
		 */
		if (ch === '\n' || ch === '\t' || ch === ' ') {
			while (
				_i < chars.length &&
				(chars[_i] === '\n' || chars[_i] === '\t' || chars[_i] === ' ')
			) {
				_i++;
			}
			continue;
		}

		if (ch === ',') {
			return undefined;
		}

		if (ch === ')') {
			tokens.push({ type: Tok.ParenClose });
			continue;
		}

		if (ch === '+') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return undefined;
		}

		if (ch === '-') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			if (is_ident(chars)) {
				tokens.push({ type: Tok.Ident, value: ident(chars) });
				continue;
			}
			return undefined;
		}

		if (ch === '.') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return undefined;
		}

		if (ch === '/') {
			while (
				_i < chars.length &&
				(chars[_i] === '\n' || chars[_i] === '\t' || chars[_i] === ' ')
			) {
				_i++;
			}
			let alpha;
			if (is_num(chars)) {
				alpha = num(chars);
				if (alpha.type !== Tok.Hue) {
					tokens.push({ type: Tok.Alpha, value: alpha });
					continue;
				}
			}
			if (is_ident(chars)) {
				if (ident(chars) === 'none') {
					tokens.push({
						type: Tok.Alpha,
						value: { type: Tok.None, value: undefined }
					});
					continue;
				}
			}
			return undefined;
		}

		if (/\d/.test(ch)) {
			_i--;
			tokens.push(num(chars));
			continue;
		}

		if (IdentStartCodePoint.test(ch)) {
			_i--;
			tokens.push(identlike(chars));
			continue;
		}

		/*
			Treat everything not already handled as an error.
		 */
		return undefined;
	}

	return tokens;
}

function parseColorSyntax(tokens) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function || token.value !== 'color') {
		return undefined;
	}
	token = tokens[tokens._i++];
	if (token.type !== Tok.Ident) {
		return undefined;
	}
	const mode = colorProfiles[token.value];
	if (!mode) {
		return undefined;
	}
	const res = { mode };
	const coords = consumeCoords(tokens, false);
	if (!coords) {
		return undefined;
	}
	const channels = getMode(mode).channels;
	for (let ii = 0, c, ch; ii < channels.length; ii++) {
		c = coords[ii];
		ch = channels[ii];
		if (c.type !== Tok.None) {
			res[ch] = c.type === Tok.Number ? c.value : c.value / 100;
			if (ch === 'alpha') {
				res[ch] = Math.max(0, Math.min(1, res[ch]));
			}
		}
	}
	return res;
}

function consumeCoords(tokens, includeHue) {
	const coords = [];
	let token;
	while (tokens._i < tokens.length) {
		token = tokens[tokens._i++];
		if (
			token.type === Tok.None ||
			token.type === Tok.Number ||
			token.type === Tok.Alpha ||
			token.type === Tok.Percentage ||
			(includeHue && token.type === Tok.Hue)
		) {
			coords.push(token);
			continue;
		}
		if (token.type === Tok.ParenClose) {
			if (tokens._i < tokens.length) {
				return undefined;
			}
			continue;
		}
		return undefined;
	}

	if (coords.length < 3 || coords.length > 4) {
		return undefined;
	}

	if (coords.length === 4) {
		if (coords[3].type !== Tok.Alpha) {
			return undefined;
		}
		coords[3] = coords[3].value;
	}
	if (coords.length === 3) {
		coords.push({ type: Tok.None, value: undefined });
	}

	return coords.every(c => c.type !== Tok.Alpha) ? coords : undefined;
}

function parseModernSyntax(tokens, includeHue) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function) {
		return undefined;
	}
	let coords = consumeCoords(tokens, includeHue);
	if (!coords) {
		return undefined;
	}
	coords.unshift(token.value);
	return coords;
}

const parse = color => {
	if (typeof color !== 'string') {
		return undefined;
	}
	const tokens = tokenize(color);
	const parsed = tokens ? parseModernSyntax(tokens, true) : undefined;
	let result = undefined;
	let i = 0;
	let len = parsers.length;
	while (i < len) {
		if ((result = parsers[i++](color, parsed)) !== undefined) {
			return result;
		}
	}
	return tokens ? parseColorSyntax(tokens) : undefined;
};

function parseRgb(color, parsed) {
	if (!parsed || (parsed[0] !== 'rgb' && parsed[0] !== 'rgba')) {
		return undefined;
	}
	const res = { mode: 'rgb' };
	const [, r, g, b, alpha] = parsed;
	if (r.type === Tok.Hue || g.type === Tok.Hue || b.type === Tok.Hue) {
		return undefined;
	}
	if (r.type !== Tok.None) {
		res.r = r.type === Tok.Number ? r.value / 255 : r.value / 100;
	}
	if (g.type !== Tok.None) {
		res.g = g.type === Tok.Number ? g.value / 255 : g.value / 100;
	}
	if (b.type !== Tok.None) {
		res.b = b.type === Tok.Number ? b.value / 255 : b.value / 100;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const parseTransparent = c =>
	c === 'transparent'
		? { mode: 'rgb', r: 0, g: 0, b: 0, alpha: 0 }
		: undefined;

const lerp = (a, b, t) => a + t * (b - a);

const get_classes = arr => {
	let classes = [];
	for (let i = 0; i < arr.length - 1; i++) {
		let a = arr[i];
		let b = arr[i + 1];
		if (a === undefined && b === undefined) {
			classes.push(undefined);
		} else if (a !== undefined && b !== undefined) {
			classes.push([a, b]);
		} else {
			classes.push(a !== undefined ? [a, a] : [b, b]);
		}
	}
	return classes;
};

const interpolatorPiecewise = interpolator => arr => {
	let classes = get_classes(arr);
	return t => {
		let cls = t * classes.length;
		let idx = t >= 1 ? classes.length - 1 : Math.max(Math.floor(cls), 0);
		let pair = classes[idx];
		return pair === undefined
			? undefined
			: interpolator(pair[0], pair[1], cls - idx);
	};
};

const interpolatorLinear = interpolatorPiecewise(lerp);

const fixupAlpha = arr => {
	let some_defined = false;
	let res = arr.map(v => {
		if (v !== undefined) {
			some_defined = true;
			return v;
		}
		return 1;
	});
	return some_defined ? res : arr;
};

/*
	sRGB color space
 */

const definition$d = {
	mode: 'rgb',
	channels: ['r', 'g', 'b', 'alpha'],
	parse: [
		parseRgb,
		parseHex,
		parseRgbLegacy,
		parseNamed,
		parseTransparent,
		'srgb'
	],
	serialize: 'srgb',
	interpolate: {
		r: interpolatorLinear,
		g: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},
	gamut: true,
	white: { r: 1, g: 1, b: 1 },
	black: { r: 0, g: 0, b: 0 }
};

/*
	Convert A98 RGB values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
*/

const linearize$2 = (v = 0) => Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);

const convertA98ToXyz65 = a98 => {
	let r = linearize$2(a98.r);
	let g = linearize$2(a98.g);
	let b = linearize$2(a98.b);
	let res = {
		mode: 'xyz65',
		x:
			0.5766690429101305 * r +
			0.1855582379065463 * g +
			0.1882286462349947 * b,
		y:
			0.297344975250536 * r +
			0.6273635662554661 * g +
			0.0752914584939979 * b,
		z:
			0.0270313613864123 * r +
			0.0706888525358272 * g +
			0.9913375368376386 * b
	};
	if (a98.alpha !== undefined) {
		res.alpha = a98.alpha;
	}
	return res;
};

/*
	Convert CIE XYZ D65 values to A98 RGB

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const gamma$2 = v => Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);

const convertXyz65ToA98 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'a98',
		r: gamma$2(
			x * 2.0415879038107465 -
				y * 0.5650069742788597 -
				0.3447313507783297 * z
		),
		g: gamma$2(
			x * -0.9692436362808798 +
				y * 1.8759675015077206 +
				0.0415550574071756 * z
		),
		b: gamma$2(
			x * 0.0134442806320312 -
				y * 0.1183623922310184 +
				1.0151749943912058 * z
		)
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const fn$2 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs <= 0.04045) {
		return c / 12.92;
	}
	return (Math.sign(c) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
};

const convertRgbToLrgb = ({ r, g, b, alpha }) => {
	let res = {
		mode: 'lrgb',
		r: fn$2(r),
		g: fn$2(g),
		b: fn$2(b)
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

/*
	Convert sRGB values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://observablehq.com/@danburzo/color-matrix-calculator
*/


const convertRgbToXyz65 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz65',
		x:
			0.4123907992659593 * r +
			0.357584339383878 * g +
			0.1804807884018343 * b,
		y:
			0.2126390058715102 * r +
			0.715168678767756 * g +
			0.0721923153607337 * b,
		z:
			0.0193308187155918 * r +
			0.119194779794626 * g +
			0.9505321522496607 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const fn$1 = (c = 0) => {
	const abs = Math.abs(c);
	if (abs > 0.0031308) {
		return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
	}
	return c * 12.92;
};

const convertLrgbToRgb = ({ r, g, b, alpha }, mode = 'rgb') => {
	let res = {
		mode,
		r: fn$1(r),
		g: fn$1(g),
		b: fn$1(b)
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

/*
	CIE XYZ D65 values to sRGB.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://observablehq.com/@danburzo/color-matrix-calculator
*/


const convertXyz65ToRgb = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb({
		r:
			x * 3.2409699419045226 -
			y * 1.5373831775700939 -
			0.4986107602930034 * z,
		g:
			x * -0.9692436362808796 +
			y * 1.8759675015077204 +
			0.0415550574071756 * z,
		b:
			x * 0.0556300796969936 -
			y * 0.2039769588889765 +
			1.0569715142428784 * z
	});
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const definition$c = {
	...definition$d,
	mode: 'a98',
	parse: ['a98-rgb'],
	serialize: 'a98-rgb',

	fromMode: {
		rgb: color => convertXyz65ToA98(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToA98
	},

	toMode: {
		rgb: color => convertXyz65ToRgb(convertA98ToXyz65(color)),
		xyz65: convertA98ToXyz65
	}
};

const normalizeHue = hue => ((hue = hue % 360) < 0 ? hue + 360 : hue);

const hue = (hues, fn) => {
	return hues
		.map((hue, idx, arr) => {
			if (hue === undefined) {
				return hue;
			}
			let normalized = normalizeHue(hue);
			if (idx === 0 || hues[idx - 1] === undefined) {
				return normalized;
			}
			return fn(normalized - normalizeHue(arr[idx - 1]));
		})
		.reduce((acc, curr) => {
			if (
				!acc.length ||
				curr === undefined ||
				acc[acc.length - 1] === undefined
			) {
				acc.push(curr);
				return acc;
			}
			acc.push(curr + acc[acc.length - 1]);
			return acc;
		}, []);
};

const fixupHueShorter = arr =>
	hue(arr, d => (Math.abs(d) <= 180 ? d : d - 360 * Math.sign(d)));

const differenceHueSaturation = (std, smp) => {
	if (std.h === undefined || smp.h === undefined || !std.s || !smp.s) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((((smp_h - std_h + 360) / 2) * Math.PI) / 180);
	return 2 * Math.sqrt(std.s * smp.s) * dH;
};

const differenceHueNaive = (std, smp) => {
	if (std.h === undefined || smp.h === undefined) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	if (Math.abs(smp_h - std_h) > 180) {
		// todo should this be normalized once again?
		return std_h - (smp_h - 360 * Math.sign(smp_h - std_h));
	}
	return smp_h - std_h;
};

const differenceHueChroma = (std, smp) => {
	if (std.h === undefined || smp.h === undefined || !std.c || !smp.c) {
		return 0;
	}
	let std_h = normalizeHue(std.h);
	let smp_h = normalizeHue(smp.h);
	let dH = Math.sin((((smp_h - std_h + 360) / 2) * Math.PI) / 180);
	return 2 * Math.sqrt(std.c * smp.c) * dH;
};

const averageAngle = val => {
	// See: https://en.wikipedia.org/wiki/Mean_of_circular_quantities
	let sum = val.reduce(
		(sum, val) => {
			if (val !== undefined) {
				let rad = (val * Math.PI) / 180;
				sum.sin += Math.sin(rad);
				sum.cos += Math.cos(rad);
			}
			return sum;
		},
		{ sin: 0, cos: 0 }
	);
	let angle = (Math.atan2(sum.sin, sum.cos) * 180) / Math.PI;
	return angle < 0 ? 360 + angle : angle;
};

/* 
	References: 
		* https://drafts.csswg.org/css-color/#lab-to-lch
		* https://drafts.csswg.org/css-color/#color-conversion-code
*/
const convertLabToLch = ({ l, a, b, alpha }, mode = 'lch') => {
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = { mode, l, c };
	if (c) res.h = normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

/* 
	References: 
		* https://drafts.csswg.org/css-color/#lch-to-lab
		* https://drafts.csswg.org/css-color/#color-conversion-code
*/
const convertLchToLab = ({ l, c, h, alpha }, mode = 'lab') => {
	if (h === undefined) h = 0;
	let res = {
		mode,
		l,
		a: c ? c * Math.cos((h / 180) * Math.PI) : 0,
		b: c ? c * Math.sin((h / 180) * Math.PI) : 0
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

/*
	The XYZ tristimulus values (white point)
	of standard illuminants for the CIE 1931 2° 
	standard observer.

	See: https://en.wikipedia.org/wiki/Standard_illuminant
 */

const D50 = {
	X: 0.3457 / 0.3585,
	Y: 1,
	Z: (1 - 0.3457 - 0.3585) / 0.3585
};

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB

function convertHslToRgb({ h, s, l, alpha }) {
	h = normalizeHue(h !== undefined ? h : 0);
	if (s === undefined) s = 0;
	if (l === undefined) l = 0;
	let m1 = l + s * (l < 0.5 ? l : 1 - l);
	let m2 = m1 - (m1 - l) * 2 * Math.abs(((h / 60) % 2) - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = { r: m1, g: m2, b: 2 * l - m1 };
			break;
		case 1:
			res = { r: m2, g: m1, b: 2 * l - m1 };
			break;
		case 2:
			res = { r: 2 * l - m1, g: m1, b: m2 };
			break;
		case 3:
			res = { r: 2 * l - m1, g: m2, b: m1 };
			break;
		case 4:
			res = { r: m2, g: 2 * l - m1, b: m1 };
			break;
		case 5:
			res = { r: m1, g: 2 * l - m1, b: m2 };
			break;
		default:
			res = { r: 2 * l - m1, g: 2 * l - m1, b: 2 * l - m1 };
	}
	res.mode = 'rgb';
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation

function convertRgbToHsl({ r, g, b, alpha }) {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let M = Math.max(r, g, b),
		m = Math.min(r, g, b);
	let res = {
		mode: 'hsl',
		s: M === m ? 0 : (M - m) / (1 - Math.abs(M + m - 1)),
		l: 0.5 * (M + m)
	};
	if (M - m !== 0)
		res.h =
			(M === r
				? (g - b) / (M - m) + (g < b) * 6
				: M === g
				? (b - r) / (M - m) + 2
				: (r - g) / (M - m) + 4) * 60;
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}

const hueToDeg = (val, unit) => {
	switch (unit) {
		case 'deg':
			return +val;
		case 'rad':
			return (val / Math.PI) * 180;
		case 'grad':
			return (val / 10) * 9;
		case 'turn':
			return val * 360;
	}
};

/*
	hsl() regular expressions for legacy format
	Reference: https://drafts.csswg.org/css-color/#the-hsl-notation
 */
const hsl_old = new RegExp(
	`^hsla?\\(\\s*${hue$1}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
);

const parseHslLegacy = color => {
	let match = color.match(hsl_old);
	if (!match) return;
	let res = { mode: 'hsl' };

	if (match[3] !== undefined) {
		res.h = +match[3];
	} else if (match[1] !== undefined && match[2] !== undefined) {
		res.h = hueToDeg(match[1], match[2]);
	}

	if (match[4] !== undefined) {
		res.s = Math.min(Math.max(0, match[4] / 100), 1);
	}

	if (match[5] !== undefined) {
		res.l = Math.min(Math.max(0, match[5] / 100), 1);
	}

	if (match[6] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, match[6] / 100));
	} else if (match[7] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, +match[7]));
	}
	return res;
};

function parseHsl(color, parsed) {
	if (!parsed || (parsed[0] !== 'hsl' && parsed[0] !== 'hsla')) {
		return undefined;
	}
	const res = { mode: 'hsl' };
	const [, h, s, l, alpha] = parsed;

	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}

	if (s.type !== Tok.None) {
		if (s.type === Tok.Hue) {
			return undefined;
		}
		res.s = s.value / 100;
	}

	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) {
			return undefined;
		}
		res.l = l.value / 100;
	}

	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const definition$b = {
	mode: 'hsl',

	toMode: {
		rgb: convertHslToRgb
	},

	fromMode: {
		rgb: convertRgbToHsl
	},

	channels: ['h', 's', 'l', 'alpha'],

	ranges: {
		h: [0, 360]
	},

	gamut: 'rgb',

	parse: [parseHsl, parseHslLegacy],
	serialize: c =>
		`hsl(${c.h !== undefined ? c.h : 'none'} ${
			c.s !== undefined ? c.s * 100 + '%' : 'none'
		} ${c.l !== undefined ? c.l * 100 + '%' : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		s: interpolatorLinear,
		l: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},

	difference: {
		h: differenceHueSaturation
	},

	average: {
		h: averageAngle
	}
};

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB

function convertHsvToRgb({ h, s, v, alpha }) {
	h = normalizeHue(h !== undefined ? h : 0);
	if (s === undefined) s = 0;
	if (v === undefined) v = 0;
	let f = Math.abs(((h / 60) % 2) - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = { r: v, g: v * (1 - s * f), b: v * (1 - s) };
			break;
		case 1:
			res = { r: v * (1 - s * f), g: v, b: v * (1 - s) };
			break;
		case 2:
			res = { r: v * (1 - s), g: v, b: v * (1 - s * f) };
			break;
		case 3:
			res = { r: v * (1 - s), g: v * (1 - s * f), b: v };
			break;
		case 4:
			res = { r: v * (1 - s * f), g: v * (1 - s), b: v };
			break;
		case 5:
			res = { r: v, g: v * (1 - s), b: v * (1 - s * f) };
			break;
		default:
			res = { r: v * (1 - s), g: v * (1 - s), b: v * (1 - s) };
	}
	res.mode = 'rgb';
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation

function convertRgbToHsv({ r, g, b, alpha }) {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let M = Math.max(r, g, b),
		m = Math.min(r, g, b);
	let res = {
		mode: 'hsv',
		s: M === 0 ? 0 : 1 - m / M,
		v: M
	};
	if (M - m !== 0)
		res.h =
			(M === r
				? (g - b) / (M - m) + (g < b) * 6
				: M === g
				? (b - r) / (M - m) + 2
				: (r - g) / (M - m) + 4) * 60;
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}

/*
	HWB to RGB converter
	--------------------

	References:
		* https://drafts.csswg.org/css-color/#hwb-to-rgb
		* https://en.wikipedia.org/wiki/HWB_color_model
		* http://alvyray.com/Papers/CG/HWB_JGTv208.pdf
 */


function convertHwbToRgb({ h, w, b, alpha }) {
	if (w === undefined) w = 0;
	if (b === undefined) b = 0;
	// normalize w + b to 1
	if (w + b > 1) {
		let s = w + b;
		w /= s;
		b /= s;
	}
	return convertHsvToRgb({
		h: h,
		s: b === 1 ? 1 : 1 - w / (1 - b),
		v: 1 - b,
		alpha: alpha
	});
}

/*
	RGB to HWB converter
	--------------------

	References:
		* https://drafts.csswg.org/css-color/#hwb-to-rgb
		* https://en.wikipedia.org/wiki/HWB_color_model
		* http://alvyray.com/Papers/CG/HWB_JGTv208.pdf
 */


function convertRgbToHwb(rgba) {
	let hsv = convertRgbToHsv(rgba);
	if (hsv === undefined) return undefined;
	let s = hsv.s !== undefined ? hsv.s : 0;
	let v = hsv.v !== undefined ? hsv.v : 0;
	let res = {
		mode: 'hwb',
		w: (1 - s) * v,
		b: 1 - v
	};
	if (hsv.h !== undefined) res.h = hsv.h;
	if (hsv.alpha !== undefined) res.alpha = hsv.alpha;
	return res;
}

function ParseHwb(color, parsed) {
	if (!parsed || parsed[0] !== 'hwb') {
		return undefined;
	}
	const res = { mode: 'hwb' };
	const [, h, w, b, alpha] = parsed;

	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}

	if (w.type !== Tok.None) {
		if (w.type === Tok.Hue) {
			return undefined;
		}
		res.w = w.value / 100;
	}

	if (b.type !== Tok.None) {
		if (b.type === Tok.Hue) {
			return undefined;
		}
		res.b = b.value / 100;
	}

	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const definition$a = {
	mode: 'hwb',

	toMode: {
		rgb: convertHwbToRgb
	},

	fromMode: {
		rgb: convertRgbToHwb
	},

	channels: ['h', 'w', 'b', 'alpha'],

	ranges: {
		h: [0, 360]
	},

	gamut: 'rgb',

	parse: [ParseHwb],
	serialize: c =>
		`hwb(${c.h !== undefined ? c.h : 'none'} ${
			c.w !== undefined ? c.w * 100 + '%' : 'none'
		} ${c.b !== undefined ? c.b * 100 + '%' : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		w: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},

	difference: {
		h: differenceHueNaive
	},

	average: {
		h: averageAngle
	}
};

const k = Math.pow(29, 3) / Math.pow(3, 3);
const e = Math.pow(6, 3) / Math.pow(29, 3);

let fn = v => (Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k);

const convertLabToXyz50 = ({ l, a, b, alpha }) => {
	if (l === undefined) l = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;

	let res = {
		mode: 'xyz50',
		x: fn(fx) * D50.X,
		y: fn(fy) * D50.Y,
		z: fn(fz) * D50.Z
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

/*
	CIE XYZ D50 values to sRGB.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/


const convertXyz50ToRgb = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb({
		r:
			x * 3.1341359569958707 -
			y * 1.6173863321612538 -
			0.4906619460083532 * z,
		g:
			x * -0.978795502912089 +
			y * 1.916254567259524 +
			0.03344273116131949 * z,
		b:
			x * 0.07195537988411677 -
			y * 0.2289768264158322 +
			1.405386058324125 * z
	});
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const convertLabToRgb = lab => convertXyz50ToRgb(convertLabToXyz50(lab));

/*
	Convert sRGB values to CIE XYZ D50

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	
*/


const convertRgbToXyz50 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz50',
		x:
			0.436065742824811 * r +
			0.3851514688337912 * g +
			0.14307845442264197 * b,
		y:
			0.22249319175623702 * r +
			0.7168870538238823 * g +
			0.06061979053616537 * b,
		z:
			0.013923904500943465 * r +
			0.09708128566574634 * g +
			0.7140993584005155 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const f = value => (value > e ? Math.cbrt(value) : (k * value + 16) / 116);

const convertXyz50ToLab = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let f0 = f(x / D50.X);
	let f1 = f(y / D50.Y);
	let f2 = f(z / D50.Z);

	let res = {
		mode: 'lab',
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

const convertRgbToLab = rgb => {
	let res = convertXyz50ToLab(convertRgbToXyz50(rgb));

	// Fixes achromatic RGB colors having a _slight_ chroma due to floating-point errors
	// and approximated computations in sRGB <-> CIELab.
	// See: https://github.com/d3/d3-color/pull/46
	if (rgb.r === rgb.b && rgb.b === rgb.g) {
		res.a = res.b = 0;
	}
	return res;
};

function parseLab(color, parsed) {
	if (!parsed || parsed[0] !== 'lab') {
		return undefined;
	}
	const res = { mode: 'lab' };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) {
		return undefined;
	}
	if (l.type !== Tok.None) {
		res.l = Math.min(Math.max(0, l.value), 100);
	}
	if (a.type !== Tok.None) {
		res.a = a.type === Tok.Number ? a.value : (a.value * 125) / 100;
	}
	if (b.type !== Tok.None) {
		res.b = b.type === Tok.Number ? b.value : (b.value * 125) / 100;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const definition$9 = {
	mode: 'lab',

	toMode: {
		xyz50: convertLabToXyz50,
		rgb: convertLabToRgb
	},

	fromMode: {
		xyz50: convertXyz50ToLab,
		rgb: convertRgbToLab
	},

	channels: ['l', 'a', 'b', 'alpha'],

	ranges: {
		l: [0, 100],
		a: [-100, 100],
		b: [-100, 100]
	},

	parse: [parseLab],
	serialize: c =>
		`lab(${c.l !== undefined ? c.l : 'none'} ${
			c.a !== undefined ? c.a : 'none'
		} ${c.b !== undefined ? c.b : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

function parseLch(color, parsed) {
	if (!parsed || parsed[0] !== 'lch') {
		return undefined;
	}
	const res = { mode: 'lch' };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) {
			return undefined;
		}
		res.l = Math.min(Math.max(0, l.value), 100);
	}
	if (c.type !== Tok.None) {
		res.c = Math.max(
			0,
			c.type === Tok.Number ? c.value : (c.value * 150) / 100
		);
	}
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const definition$8 = {
	mode: 'lch',

	toMode: {
		lab: convertLchToLab,
		rgb: c => convertLabToRgb(convertLchToLab(c))
	},

	fromMode: {
		rgb: c => convertLabToLch(convertRgbToLab(c)),
		lab: convertLabToLch
	},

	channels: ['l', 'c', 'h', 'alpha'],

	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	},

	parse: [parseLch],
	serialize: c =>
		`lch(${c.l !== undefined ? c.l : 'none'} ${
			c.c !== undefined ? c.c : 'none'
		} ${c.h !== undefined ? c.h : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},

	difference: {
		h: differenceHueChroma
	},

	average: {
		h: averageAngle
	}
};

const definition$7 = {
	...definition$d,
	mode: 'lrgb',

	toMode: {
		rgb: convertLrgbToRgb
	},

	fromMode: {
		rgb: convertRgbToLrgb
	},

	parse: ['srgb-linear'],
	serialize: 'srgb-linear'
};

const convertLrgbToOklab = ({ r, g, b, alpha }) => {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let L = Math.cbrt(
		0.41222147079999993 * r + 0.5363325363 * g + 0.0514459929 * b
	);
	let M = Math.cbrt(
		0.2119034981999999 * r + 0.6806995450999999 * g + 0.1073969566 * b
	);
	let S = Math.cbrt(
		0.08830246189999998 * r + 0.2817188376 * g + 0.6299787005000002 * b
	);

	let res = {
		mode: 'oklab',
		l: 0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S,
		a: 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S,
		b: 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

const convertRgbToOklab = rgb => {
	let res = convertLrgbToOklab(convertRgbToLrgb(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) {
		res.a = res.b = 0;
	}
	return res;
};

const convertOklabToLrgb = ({ l, a, b, alpha }) => {
	if (l === undefined) l = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let L = Math.pow(
		l * 0.99999999845051981432 +
			0.39633779217376785678 * a +
			0.21580375806075880339 * b,
		3
	);
	let M = Math.pow(
		l * 1.0000000088817607767 -
			0.1055613423236563494 * a -
			0.063854174771705903402 * b,
		3
	);
	let S = Math.pow(
		l * 1.0000000546724109177 -
			0.089484182094965759684 * a -
			1.2914855378640917399 * b,
		3
	);

	let res = {
		mode: 'lrgb',
		r:
			4.076741661347994 * L -
			3.307711590408193 * M +
			0.230969928729428 * S,
		g:
			-1.2684380040921763 * L +
			2.6097574006633715 * M -
			0.3413193963102197 * S,
		b:
			-0.004196086541837188 * L -
			0.7034186144594493 * M +
			1.7076147009309444 * S
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

const convertOklabToRgb = c => convertLrgbToRgb(convertOklabToLrgb(c));

function parseOklab(color, parsed) {
	if (!parsed || parsed[0] !== 'oklab') {
		return undefined;
	}
	const res = { mode: 'oklab' };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) {
		return undefined;
	}
	if (l.type !== Tok.None) {
		res.l = Math.min(
			Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
			1
		);
	}
	if (a.type !== Tok.None) {
		res.a = a.type === Tok.Number ? a.value : (a.value * 0.4) / 100;
	}
	if (b.type !== Tok.None) {
		res.b = b.type === Tok.Number ? b.value : (b.value * 0.4) / 100;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

/*
	Oklab, a perceptual color space for image processing by Björn Ottosson
	Reference: https://bottosson.github.io/posts/oklab/
 */

const definition$6 = {
	...definition$9,
	mode: 'oklab',

	toMode: {
		lrgb: convertOklabToLrgb,
		rgb: convertOklabToRgb
	},

	fromMode: {
		lrgb: convertLrgbToOklab,
		rgb: convertRgbToOklab
	},

	ranges: {
		l: [0, 1],
		a: [-0.4, 0.4],
		b: [-0.4, 0.4]
	},

	parse: [parseOklab],
	serialize: c =>
		`oklab(${c.l !== undefined ? c.l : 'none'} ${
			c.a !== undefined ? c.a : 'none'
		} ${c.b !== undefined ? c.b : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`
};

function parseOklch(color, parsed) {
	if (!parsed || parsed[0] !== 'oklch') {
		return undefined;
	}
	const res = { mode: 'oklch' };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) {
			return undefined;
		}
		res.l = Math.min(
			Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
			1
		);
	}
	if (c.type !== Tok.None) {
		res.c = Math.max(
			0,
			c.type === Tok.Number ? c.value : (c.value * 0.4) / 100
		);
	}
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

const definition$5 = {
	...definition$8,
	mode: 'oklch',

	toMode: {
		oklab: c => convertLchToLab(c, 'oklab'),
		rgb: c => convertOklabToRgb(convertLchToLab(c, 'oklab'))
	},

	fromMode: {
		rgb: c => convertLabToLch(convertRgbToOklab(c), 'oklch'),
		oklab: c => convertLabToLch(c, 'oklch')
	},

	parse: [parseOklch],
	serialize: c =>
		`oklch(${c.l !== undefined ? c.l : 'none'} ${
			c.c !== undefined ? c.c : 'none'
		} ${c.h !== undefined ? c.h : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	ranges: {
		l: [0, 1],
		c: [0, 0.4],
		h: [0, 360]
	}
};

/*
	Convert Display P3 values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/


const convertP3ToXyz65 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz65',
		x:
			0.486570948648216 * r +
			0.265667693169093 * g +
			0.1982172852343625 * b,
		y:
			0.2289745640697487 * r +
			0.6917385218365062 * g +
			0.079286914093745 * b,
		z: 0.0 * r + 0.0451133818589026 * g + 1.043944368900976 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

/*
	CIE XYZ D65 values to Display P3.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/


const convertXyz65ToP3 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb(
		{
			r:
				x * 2.4934969119414263 -
				y * 0.9313836179191242 -
				0.402710784450717 * z,
			g:
				x * -0.8294889695615749 +
				y * 1.7626640603183465 +
				0.0236246858419436 * z,
			b:
				x * 0.0358458302437845 -
				y * 0.0761723892680418 +
				0.9568845240076871 * z
		},
		'p3'
	);
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

const definition$4 = {
	...definition$d,
	mode: 'p3',
	parse: ['display-p3'],
	serialize: 'display-p3',

	fromMode: {
		rgb: color => convertXyz65ToP3(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToP3
	},

	toMode: {
		rgb: color => convertXyz65ToRgb(convertP3ToXyz65(color)),
		xyz65: convertP3ToXyz65
	}
};

/*
	Convert CIE XYZ D50 values to ProPhoto RGB

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const gamma$1 = v => {
	let abs = Math.abs(v);
	if (abs >= 1 / 512) {
		return Math.sign(v) * Math.pow(abs, 1 / 1.8);
	}
	return 16 * v;
};

const convertXyz50ToProphoto = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'prophoto',
		r: gamma$1(
			x * 1.3457868816471585 -
				y * 0.2555720873797946 -
				0.0511018649755453 * z
		),
		g: gamma$1(
			x * -0.5446307051249019 +
				y * 1.5082477428451466 +
				0.0205274474364214 * z
		),
		b: gamma$1(x * 0.0 + y * 0.0 + 1.2119675456389452 * z)
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

/*
	Convert ProPhoto RGB values to CIE XYZ D50

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const linearize$1 = (v = 0) => {
	let abs = Math.abs(v);
	if (abs >= 16 / 512) {
		return Math.sign(v) * Math.pow(abs, 1.8);
	}
	return v / 16;
};

const convertProphotoToXyz50 = prophoto => {
	let r = linearize$1(prophoto.r);
	let g = linearize$1(prophoto.g);
	let b = linearize$1(prophoto.b);
	let res = {
		mode: 'xyz50',
		x:
			0.7977666449006423 * r +
			0.1351812974005331 * g +
			0.0313477341283922 * b,
		y:
			0.2880748288194013 * r +
			0.7118352342418731 * g +
			0.0000899369387256 * b,
		z: 0 * r + 0 * g + 0.8251046025104602 * b
	};
	if (prophoto.alpha !== undefined) {
		res.alpha = prophoto.alpha;
	}
	return res;
};

/*
	ProPhoto RGB Color space

	References:
		* https://en.wikipedia.org/wiki/ProPhoto_RGB_color_space
 */

const definition$3 = {
	...definition$d,
	mode: 'prophoto',
	parse: ['prophoto-rgb'],
	serialize: 'prophoto-rgb',

	fromMode: {
		xyz50: convertXyz50ToProphoto,
		rgb: color => convertXyz50ToProphoto(convertRgbToXyz50(color))
	},

	toMode: {
		xyz50: convertProphotoToXyz50,
		rgb: color => convertXyz50ToRgb(convertProphotoToXyz50(color))
	}
};

/*
	Convert CIE XYZ D65 values to Rec. 2020

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://www.itu.int/rec/R-REC-BT.2020/en
*/

const α$1 = 1.09929682680944;
const β$1 = 0.018053968510807;
const gamma = v => {
	const abs = Math.abs(v);
	if (abs > β$1) {
		return (Math.sign(v) || 1) * (α$1 * Math.pow(abs, 0.45) - (α$1 - 1));
	}
	return 4.5 * v;
};

const convertXyz65ToRec2020 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'rec2020',
		r: gamma(
			x * 1.7166511879712683 -
				y * 0.3556707837763925 -
				0.2533662813736599 * z
		),
		g: gamma(
			x * -0.6666843518324893 +
				y * 1.6164812366349395 +
				0.0157685458139111 * z
		),
		b: gamma(
			x * 0.0176398574453108 -
				y * 0.0427706132578085 +
				0.9421031212354739 * z
		)
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

/*
	Convert Rec. 2020 values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://www.itu.int/rec/R-REC-BT.2020/en
*/

const α = 1.09929682680944;
const β = 0.018053968510807;

const linearize = (v = 0) => {
	let abs = Math.abs(v);
	if (abs < β * 4.5) {
		return v / 4.5;
	}
	return (Math.sign(v) || 1) * Math.pow((abs + α - 1) / α, 1 / 0.45);
};

const convertRec2020ToXyz65 = rec2020 => {
	let r = linearize(rec2020.r);
	let g = linearize(rec2020.g);
	let b = linearize(rec2020.b);
	let res = {
		mode: 'xyz65',
		x:
			0.6369580483012911 * r +
			0.1446169035862083 * g +
			0.1688809751641721 * b,
		y:
			0.262700212011267 * r +
			0.6779980715188708 * g +
			0.059301716469862 * b,
		z: 0 * r + 0.0280726930490874 * g + 1.0609850577107909 * b
	};
	if (rec2020.alpha !== undefined) {
		res.alpha = rec2020.alpha;
	}
	return res;
};

const definition$2 = {
	...definition$d,
	mode: 'rec2020',

	fromMode: {
		xyz65: convertXyz65ToRec2020,
		rgb: color => convertXyz65ToRec2020(convertRgbToXyz65(color))
	},

	toMode: {
		xyz65: convertRec2020ToXyz65,
		rgb: color => convertXyz65ToRgb(convertRec2020ToXyz65(color))
	},

	parse: ['rec2020'],
	serialize: 'rec2020'
};

/*
	The XYZ D50 color space
	-----------------------
 */


const definition$1 = {
	mode: 'xyz50',
	parse: ['xyz-d50'],
	serialize: 'xyz-d50',

	toMode: {
		rgb: convertXyz50ToRgb,
		lab: convertXyz50ToLab
	},

	fromMode: {
		rgb: convertRgbToXyz50,
		lab: convertLabToXyz50
	},

	channels: ['x', 'y', 'z', 'alpha'],

	ranges: {
		x: [0, 0.964],
		y: [0, 0.999],
		z: [0, 0.825]
	},

	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

/*
	Chromatic adaptation of CIE XYZ from D65 to D50 white point
	using the Bradford method.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
*/

const convertXyz65ToXyz50 = xyz65 => {
	let { x, y, z, alpha } = xyz65;
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'xyz50',
		x:
			1.0479298208405488 * x +
			0.0229467933410191 * y -
			0.0501922295431356 * z,
		y:
			0.0296278156881593 * x +
			0.990434484573249 * y -
			0.0170738250293851 * z,
		z:
			-0.0092430581525912 * x +
			0.0150551448965779 * y +
			0.7518742899580008 * z
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

/*
	Chromatic adaptation of CIE XYZ from D50 to D65 white point
	using the Bradford method.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
*/

const convertXyz50ToXyz65 = xyz50 => {
	let { x, y, z, alpha } = xyz50;
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'xyz65',
		x:
			0.9554734527042182 * x -
			0.0230985368742614 * y +
			0.0632593086610217 * z,
		y:
			-0.0283697069632081 * x +
			1.0099954580058226 * y +
			0.021041398966943 * z,
		z:
			0.0123140016883199 * x -
			0.0205076964334779 * y +
			1.3303659366080753 * z
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

/*
	The XYZ D65 color space
	-----------------------
 */


const definition = {
	mode: 'xyz65',

	toMode: {
		rgb: convertXyz65ToRgb,
		xyz50: convertXyz65ToXyz50
	},

	fromMode: {
		rgb: convertRgbToXyz65,
		xyz50: convertXyz50ToXyz65
	},

	ranges: {
		x: [0, 0.95],
		y: [0, 1],
		z: [0, 1.088]
	},

	channels: ['x', 'y', 'z', 'alpha'],

	parse: ['xyz', 'xyz-d65'],
	serialize: 'xyz-d65',

	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

const formatCss = c => {
	const color = prepare(c);
	if (!color) {
		return undefined;
	}
	const def = getMode(color.mode);
	if (!def.serialize || typeof def.serialize === 'string') {
		let res = `color(${def.serialize || `--${color.mode}`} `;
		def.channels.forEach((ch, i) => {
			if (ch !== 'alpha') {
				res +=
					(i ? ' ' : '') +
					(color[ch] !== undefined ? color[ch] : 'none');
			}
		});
		if (color.alpha !== undefined && color.alpha < 1) {
			res += ` / ${color.alpha}`;
		}
		return res + ')';
	}
	if (typeof def.serialize === 'function') {
		return def.serialize(color);
	}
	return undefined;
};

const mapper = (fn, mode = 'rgb', preserve_mode = false) => {
	let channels = mode ? getMode(mode).channels : null;
	let conv = mode ? converter(mode) : prepare;
	return color => {
		let conv_color = conv(color);
		if (!conv_color) {
			return undefined;
		}
		let res = (channels || getMode(conv_color.mode).channels).reduce(
			(res, ch) => {
				let v = fn(conv_color[ch], ch, conv_color, mode);
				if (v !== undefined && !isNaN(v)) {
					res[ch] = v;
				}
				return res;
			},
			{ mode: conv_color.mode }
		);
		if (!preserve_mode) {
			return res;
		}
		let prep = prepare(color);
		if (prep && prep.mode !== res.mode) {
			return converter(prep.mode)(res);
		}
		return res;
	};
};

const mapAlphaMultiply = (v, ch, c) => {
	if (ch !== 'alpha') {
		return (v || 0) * (c.alpha !== undefined ? c.alpha : 1);
	}
	return v;
};

const mapAlphaDivide = (v, ch, c) => {
	if (ch !== 'alpha' && c.alpha !== 0) {
		return (v || 0) / (c.alpha !== undefined ? c.alpha : 1);
	}
	return v;
};

/*
	Normalize an array of color stop positions for a gradient
	based on the rules defined in the CSS Images Module 4 spec:

	1. make the first position 0 and the last position 1 if missing
	2. sequences of unpositioned color stops should be spread out evenly
	3. no position can be smaller than any of the ones preceding it
	
	Reference: https://drafts.csswg.org/css-images-4/#color-stop-fixup

	Note: this method does not make a defensive copy of the array
	it receives as argument. Instead, it adjusts the values in-place.
 */
const normalizePositions = arr => {
	// 1. fix up first/last position if missing
	if (arr[0] === undefined) {
		arr[0] = 0;
	}
	if (arr[arr.length - 1] === undefined) {
		arr[arr.length - 1] = 1;
	}

	let i = 1;
	let j;
	let from_idx;
	let from_pos;
	let inc;
	while (i < arr.length) {
		// 2. fill up undefined positions
		if (arr[i] === undefined) {
			from_idx = i;
			from_pos = arr[i - 1];
			j = i;

			// find end of `undefined` sequence...
			while (arr[j] === undefined) j++;

			// ...and add evenly-spread positions
			inc = (arr[j] - from_pos) / (j - i + 1);
			while (i < j) {
				arr[i] = from_pos + (i + 1 - from_idx) * inc;
				i++;
			}
		} else if (arr[i] < arr[i - 1]) {
			// 3. make positions increase
			arr[i] = arr[i - 1];
		}
		i++;
	}
	return arr;
};

// Color interpolation hint exponential function
const midpoint = (H = 0.5) => t =>
	H <= 0 ? 1 : H >= 1 ? 0 : Math.pow(t, Math.log(0.5) / Math.log(H));

const isfn = o => typeof o === 'function';
const isobj = o => o && typeof o === 'object';
const isnum = o => typeof o === 'number';

const interpolate_fn = (colors, mode = 'rgb', overrides, premap) => {
	let def = getMode(mode);
	let conv = converter(mode);

	let conv_colors = [];
	let positions = [];
	let fns = {};

	colors.forEach(val => {
		if (Array.isArray(val)) {
			conv_colors.push(conv(val[0]));
			positions.push(val[1]);
		} else if (isnum(val) || isfn(val)) {
			// Color interpolation hint or easing function
			fns[positions.length] = val;
		} else {
			conv_colors.push(conv(val));
			positions.push(undefined);
		}
	});

	normalizePositions(positions);

	// override the default interpolators
	// from the color space definition with any custom ones
	let fixed = def.channels.reduce((res, ch) => {
		let ffn;
		if (isobj(overrides) && isobj(overrides[ch]) && overrides[ch].fixup) {
			ffn = overrides[ch].fixup;
		} else if (isobj(def.interpolate[ch]) && def.interpolate[ch].fixup) {
			ffn = def.interpolate[ch].fixup;
		} else {
			ffn = v => v;
		}
		res[ch] = ffn(conv_colors.map(color => color[ch]));
		return res;
	}, {});

	if (premap) {
		let ccolors = conv_colors.map((color, idx) => {
			return def.channels.reduce(
				(c, ch) => {
					c[ch] = fixed[ch][idx];
					return c;
				},
				{ mode }
			);
		});
		fixed = def.channels.reduce((res, ch) => {
			res[ch] = ccolors.map(c => {
				let v = premap(c[ch], ch, c, mode);
				return isNaN(v) ? undefined : v;
			});
			return res;
		}, {});
	}

	let interpolators = def.channels.reduce((res, ch) => {
		let ifn;
		if (isfn(overrides)) {
			ifn = overrides;
		} else if (isobj(overrides) && isfn(overrides[ch])) {
			ifn = overrides[ch];
		} else if (
			isobj(overrides) &&
			isobj(overrides[ch]) &&
			overrides[ch].use
		) {
			ifn = overrides[ch].use;
		} else if (isfn(def.interpolate[ch])) {
			ifn = def.interpolate[ch];
		} else if (isobj(def.interpolate[ch])) {
			ifn = def.interpolate[ch].use;
		}

		res[ch] = ifn(fixed[ch]);
		return res;
	}, {});

	let n = conv_colors.length - 1;

	return t => {
		// clamp t to the [0, 1] interval
		t = Math.min(Math.max(0, t), 1);

		if (t <= positions[0]) {
			return conv_colors[0];
		}

		if (t > positions[n]) {
			return conv_colors[n];
		}

		// Convert `t` from [0, 1] to `t0` between the appropriate two colors.
		// First, look for the two colors between which `t` is located.
		// Note: this can be optimized by searching for the index
		// through bisection instead of start-to-end.
		let idx = 0;
		while (positions[idx] < t) idx++;
		let start = positions[idx - 1];
		let delta = positions[idx] - start;

		let P = (t - start) / delta;

		// use either the local easing, or the global easing, if any
		let fn = fns[idx] || fns[0];
		if (fn !== undefined) {
			if (isnum(fn)) {
				fn = midpoint((fn - start) / delta);
			}
			P = fn(P);
		}

		let t0 = (idx - 1 + P) / n;

		return def.channels.reduce(
			(res, channel) => {
				let val = interpolators[channel](t0);
				if (val !== undefined) {
					res[channel] = val;
				}
				return res;
			},
			{ mode }
		);
	};
};

const interpolateWith =
	(premap, postmap) =>
	(colors, mode = 'rgb', overrides) => {
		let post = postmap ? mapper(postmap, mode) : undefined;
		let it = interpolate_fn(colors, mode, overrides, premap);
		return post ? t => post(it(t)) : it;
	};

const interpolateWithPremultipliedAlpha = interpolateWith(
	mapAlphaMultiply,
	mapAlphaDivide
);

const calc_color_mix_native = (colorSpace, c1, c2, p1, p2) => {
    return `color-mix(in ${colorSpace}, ${c1} ${p1 != null ? p1 * 100 + '%' : ''}, ${c2} ${p2 != null ? p2 * 100 + '%' : ''})`;
};
const calc_color_mix_shim = func_lazy(() => {
    useMode(definition$d);
    useMode(definition$7);
    useMode(definition$b);
    useMode(definition$2);
    useMode(definition$9);
    useMode(definition$6);
    useMode(definition$8);
    useMode(definition$5);
    useMode(definition$a);
    useMode(definition$4);
    useMode(definition$3);
    useMode(definition);
    useMode(definition$1);
    useMode(definition$c);
    return (colorSpace, c1, c2, p1, p2) => {
        // 百分比归一化 (根据 CSS Color 5 § 3.1)
        const ps = z({ p1, p2 })
            // 规则 2: 都省略，默认为 50%
            .with({ p1: N.nullish, p2: N.nullish }, () => ({ t: 0.5 }))
            // 规则 3: p2 省略
            .with({ p1: N.number, p2: N.nullish }, (ps) => {
            return { t: math_clamp(ps.p1, 0, 1) / 1 };
        })
            // 规则 4: p1 省略
            .with({ p1: N.nullish, p2: N.number }, (ps) => {
            return { t: math_clamp(ps.p2, 0, 1) };
        })
            // 规则 5 & 6: p1 和 p2 都提供
            .with({ p1: N.number, p2: N.number }, (ps) => {
            const sum = ps.p1 + ps.p2;
            if (sum === 0) {
                // §3.2 步骤 1: 如果 alpha 乘数为 0，结果是透明的
                // 返回目标色彩空间的透明色 (这里简化为 CSS transparent)
                // 注意：规范说 'transparent', converted to the specified interpolation <color-space>
                return { t: 0.5, alpha: 0 };
            }
            return { t: ps.p2 / sum, alpha: sum < 1 ? sum : 1 };
        })
            .exhaustive();
        // colorSpace: 'srgb' | 'srgb-linear' | 'display-p3' | 'a98-rgb' | 'prophoto-rgb' | 'rec2020' | 'lab' | 'oklab' | 'xyz' | 'xyz-d50' | 'xyz-d65'
        const mode = z(colorSpace)
            .with('srgb', () => 'rgb')
            .with('srgb-linear', () => 'lrgb')
            .with('hsl', 'rec2020', 'lab', 'oklab', 'lch', 'oklch', 'hwb', (v) => v)
            .with('display-p3', () => 'p3')
            .with('prophoto-rgb', () => 'prophoto')
            .with('a98-rgb', () => 'a98')
            .with('xyz', 'xyz-d65', () => 'xyz65')
            .with('xyz-d50', () => 'xyz50')
            .otherwise(() => 'rgb');
        if (ps.alpha === 0) {
            return 'transparent';
        }
        const mixedColorObject = interpolateWithPremultipliedAlpha([c1, c2], mode)(ps.t);
        if (ps.alpha != null && ps.alpha !== 1) {
            mixedColorObject.alpha = math_clamp((mixedColorObject.alpha ?? 1) * ps.alpha, 0, 1);
        }
        return formatCss(mixedColorObject);
    };
});
const calc_color_mix = CSS.supports('color:color-mix(in srgb,#000,#000)') ? calc_color_mix_native : calc_color_mix_shim;

let CssColorMixElement = (() => {
    let _classDecorators = [t('css-color-mix')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _var_decorators;
    let _var_initializers = [];
    let _var_extraInitializers = [];
    let _in_decorators;
    let _in_initializers = [];
    let _in_extraInitializers = [];
    let _c1_decorators;
    let _c1_initializers = [];
    let _c1_extraInitializers = [];
    let _p1_decorators;
    let _p1_initializers = [];
    let _p1_extraInitializers = [];
    let _c2_decorators;
    let _c2_initializers = [];
    let _c2_extraInitializers = [];
    let _p2_decorators;
    let _p2_initializers = [];
    let _p2_extraInitializers = [];
    var CssColorMixElement = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _var_decorators = [n({ type: String, reflect: true, attribute: true })];
            _in_decorators = [n({ type: String, reflect: true, attribute: true })];
            _c1_decorators = [n({ type: String, reflect: true, attribute: true })];
            _p1_decorators = [safeProperty(percentageToSafeConverter)];
            _c2_decorators = [n({ type: String, reflect: true, attribute: true })];
            _p2_decorators = [safeProperty(percentageToSafeConverter)];
            __esDecorate(this, null, _var_decorators, { kind: "accessor", name: "var", static: false, private: false, access: { has: obj => "var" in obj, get: obj => obj.var, set: (obj, value) => { obj.var = value; } }, metadata: _metadata }, _var_initializers, _var_extraInitializers);
            __esDecorate(this, null, _in_decorators, { kind: "accessor", name: "in", static: false, private: false, access: { has: obj => "in" in obj, get: obj => obj.in, set: (obj, value) => { obj.in = value; } }, metadata: _metadata }, _in_initializers, _in_extraInitializers);
            __esDecorate(this, null, _c1_decorators, { kind: "accessor", name: "c1", static: false, private: false, access: { has: obj => "c1" in obj, get: obj => obj.c1, set: (obj, value) => { obj.c1 = value; } }, metadata: _metadata }, _c1_initializers, _c1_extraInitializers);
            __esDecorate(this, null, _p1_decorators, { kind: "accessor", name: "p1", static: false, private: false, access: { has: obj => "p1" in obj, get: obj => obj.p1, set: (obj, value) => { obj.p1 = value; } }, metadata: _metadata }, _p1_initializers, _p1_extraInitializers);
            __esDecorate(this, null, _c2_decorators, { kind: "accessor", name: "c2", static: false, private: false, access: { has: obj => "c2" in obj, get: obj => obj.c2, set: (obj, value) => { obj.c2 = value; } }, metadata: _metadata }, _c2_initializers, _c2_extraInitializers);
            __esDecorate(this, null, _p2_decorators, { kind: "accessor", name: "p2", static: false, private: false, access: { has: obj => "p2" in obj, get: obj => obj.p2, set: (obj, value) => { obj.p2 = value; } }, metadata: _metadata }, _p2_initializers, _p2_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CssColorMixElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static shadowRootOptions = {
            ...r.shadowRootOptions,
            mode: 'closed',
        };
        static calcColorMix = calc_color_mix;
        static calcColorMixNative = calc_color_mix_native;
        static calcColorMixShim = calc_color_mix_shim;
        static styles = i `:host{display:none}`;
        #var_accessor_storage = __runInitializers(this, _var_initializers, '--color-mix');
        get var() { return this.#var_accessor_storage; }
        set var(value) { this.#var_accessor_storage = value; }
        #in_accessor_storage = (__runInitializers(this, _var_extraInitializers), __runInitializers(this, _in_initializers, 'srgb'));
        get in() { return this.#in_accessor_storage; }
        set in(value) { this.#in_accessor_storage = value; }
        #c1_accessor_storage = (__runInitializers(this, _in_extraInitializers), __runInitializers(this, _c1_initializers, '#000'));
        get c1() { return this.#c1_accessor_storage; }
        set c1(value) { this.#c1_accessor_storage = value; }
        #p1_accessor_storage = (__runInitializers(this, _c1_extraInitializers), __runInitializers(this, _p1_initializers, null));
        get p1() { return this.#p1_accessor_storage; }
        set p1(value) { this.#p1_accessor_storage = value; }
        #c2_accessor_storage = (__runInitializers(this, _p1_extraInitializers), __runInitializers(this, _c2_initializers, '#000'));
        get c2() { return this.#c2_accessor_storage; }
        set c2(value) { this.#c2_accessor_storage = value; }
        #p2_accessor_storage = (__runInitializers(this, _c2_extraInitializers), __runInitializers(this, _p2_initializers, null));
        get p2() { return this.#p2_accessor_storage; }
        set p2(value) { this.#p2_accessor_storage = value; }
        __styleEle = (__runInitializers(this, _p2_extraInitializers), document.createElement('style'));
        constructor() {
            super();
            this.appendChild(this.__styleEle);
        }
        updated(_changedProperties) {
            let color1 = this.c1;
            let color2 = this.c2;
            const color1_is_css_var = color1.startsWith('--');
            const color2_is_css_var = color2.startsWith('--');
            if (color1_is_css_var || color2_is_css_var) {
                const styles = getComputedStyle(this);
                color1 = color1_is_css_var ? styles.getPropertyValue(color1) || '#000' : color1;
                color2 = color2_is_css_var ? styles.getPropertyValue(color2) || '#000' : color2;
            }
            let p1 = this.p1;
            let p2 = this.p2;
            if (Number.isNaN(p1))
                p1 = null;
            if (Number.isNaN(Path2D))
                p2 = null;
            this.__styleEle.innerHTML =
                // 自定义属性，不使用CSS.registry，它是永久注册。而使用css声明式是可以移除和重用的
                `@property ${this.in}{syntax:'<color>';inherits:false;initial-value:#000;}` +
                    // 将计算结果混合配置到作用域中
                    `:scope{${this.var}:${CssColorMixElement.calcColorMix(this.in, color1, color2, p1, p2)}}`;
            super.updated(_changedProperties);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return CssColorMixElement = _classThis;
})();

export { CssColorMixElement };
