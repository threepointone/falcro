import request from 'superagent';
import Router from 'falcor-router';
import falcor from 'falcor';

// a 'service' that fetches user details from github
function user(id){
  return new Promise((resolve, reject) =>
    request.get(`https://api.github.com/users/${id}`).end((err, res) =>
      err ? reject(err) : resolve(res.body)));
}

var model = new falcor.Model({
  source: new Router([{
    // define a single route corresponding to the above service
    route: 'users[{keys:ids}]',
    get: async function (pathSet){
      let responses = await Promise.all(pathSet.ids.map(user));
      return pathSet.ids.map((id, i) =>
        ({path: ['users', id],  value: responses[i]}));
    }
  }])
});

console.log(model.getCache()); // empty, all good

model.get(`users.threepointone['id', 'url', 'name']`)
  .subscribe(function(json){
    console.log(json);
    try{
      console.log(model.getCache()); // throws error
    // Maximum call stack size exceeded
    }
    catch(e){
      console.error(e.stack);
    }


  }, function(error){
    console.error(error);
  });
