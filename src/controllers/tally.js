import {results} from '../tally';

export default {

  /**
   * @param {object} req - http request
   * @param {object} res - http response
   * @returns {void}
   */
  winner: function indexHandler(req, res) {
    results(req.params.electionId, function(result, err) {
      console.log("tally result:", result);
      if (err) {
        console.error(err);
      }
      res.json(result);
    });
  }
};
