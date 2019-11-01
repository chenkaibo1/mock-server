function testable(target, name, descriptor) {
  console.log(name)
  console.log(descriptor)
  let oldValue = descriptor.value
  descriptor.value = function() {
    let beginTime = new Date()
    let result = oldValue.apply(null, arguments)
    let endTime = new Date()
    let wasteTime = endTime.getTime() - beginTime.getTime()
    console.log(`执行方法'${name}'花了${wasteTime} ms`, arguments, result)
    return result
  }
}

class Person {
  @testable
  countStars(num) {
    for (var i = 0; i < num; i++) {
      console.log(`第${i}个星星`)
    }
  }
}
const person = new Person()
person.countStars(10000)
