exports.open = function(req, res){
  res.send('roomName' + req.params.roomName);
};