import {popularity, results} from '../tally';

export default {

  /**
   * @param {object} req - http request
   * @param {object} res - http response
   * @returns {void}
   */
  winner: function indexHandler(req, res) {
    const electionId = req.params.electionId
    results(electionId, function(result, err) {
      console.log("tally result:", result);
      if (err) {
        console.error(err);
      }
      res.set('Content-Type', 'text/plain');  
      res.send(result);
    });
  },

  popularity: function popularityHandler(req, res) {
    const electionId = req.params.electionId
    popularity(electionId, function(result, err) {
      if (err) {
        console.error(err);
      }
      res.json(result);
    });
  }
};
