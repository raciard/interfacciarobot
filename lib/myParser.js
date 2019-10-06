const Transform = require('stream').Transform


class MyParser extends Transform {
  constructor(options = {}) {
    super(options)

    if (typeof options.length !== 'number') {
      throw new TypeError('"length" is not a number')
    }

    if (options.length < 1) {
      throw new TypeError('"length" is not greater than 0')
    }

    this.start = options.start;
    this.length = options.length
    this.position = 0
    this.buffer = Buffer.alloc(this.length)
  }

  _transform(chunk, encoding, cb) {
    let cursor = 0
    while (cursor < chunk.length) {
      
      let fl = false
      if(chunk[cursor] == 174){
          this.buffer = Buffer.alloc(1);
          fl = true;
      }
      this.buffer[this.position] = chunk[cursor]
      
      cursor++
      this.position++

      

      if (this.position === this.length  || fl) {
        this.push(this.buffer)
        
       


        this.buffer = Buffer.alloc(this.length)
        this.position = 0
      }
    }
    cb()
  }

  _flush(cb) {
    this.push(this.buffer.slice(0, this.position))
    this.buffer = Buffer.alloc(this.length)
    cb()
  }
}

module.exports = MyParser