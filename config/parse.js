const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.split('=');
  acc[key] = (val === undefined ? true : val);
  return acc;
}, {});

Object.prototype.lookup = Array.prototype.lookup = function (path) {
  const [key, ...nextPath] = path.split('.');
  const mustGoDeeper = this.hasOwnProperty(key) && this[key] instanceof Object;
  return  mustGoDeeper ? this[key].lookup(nextPath.join('.')) : String(this[key]);
};

let text = '';
process.stdin.on('data', chunk => text += chunk);
process.stdin.on('end', () => process.stdout.write(JSON.parse(text).lookup(args.key)));

