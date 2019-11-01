var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return c > 3 && r && Object.defineProperty(target, key, r), r
  }
function testable(target, name, descriptor) {
  console.log(target)
  console.log(name)
  console.log(descriptor)
  var oldValue = descriptor.value
  descriptor.value = function() {
    var beginTime = new Date()
    var result = oldValue.apply(null, arguments)
    var endTime = new Date()
    var wasteTime = endTime.getTime() - beginTime.getTime()
    console.log("\u6267\u884C\u65B9\u6CD5'" + name + "'\u82B1\u4E86" + wasteTime + ' ms', arguments, result)
    return result
  }
}
var Person /** @class */ = (function() {
  function Person() {}
  Person.prototype.countStars = function(num) {
    for (var i = 0; i < num; i++) {
      console.log('\u7B2C' + i + '\u4E2A\u661F\u661F')
    }
  }
  __decorate([ testable ], Person.prototype, 'countStars')
  return Person
})()
var person = new Person()
person.countStars(10000)
