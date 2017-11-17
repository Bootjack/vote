
import sqlite3 from 'sqlite3';
import path from 'path';
import { head, forEach } from 'lodash';

console.log('getting sqlite3 client verbose');
const sqlite3Client = sqlite3.verbose();

let dbPath = path.resolve(__dirname, '../../data/elections');
console.log(dbPath);
const db = new sqlite3Client.Database(dbPath);

export function createElection(details) {

}

/**
* Returns an election and all related metadata
*/
export function getElection(electionId, cb) {
  let electionData = {};
  db.serialize(function() {
    db.all(`
    SELECT
      elections.id as electionId,
      elections.name as electionName,
      elections.description as electionDescription,
      start_time,
      end_time,
      map.option_id,
      options.id as optionId,
      options.name as optionName,
      options.description as optionDescription
    FROM elections
    LEFT JOIN election_option_map map ON map.election_id = elections.id
    LEFT JOIN options ON options.id = map.option_id
    ORDER BY options.name ASC
    `, function(err, results) {
      if (err) {
        cb(null, { error: err });
      }

      if (results) {
        const firstRow = head(results);
        console.log('firstRow', firstRow);
        electionData = {
          id: firstRow.electionId,
          name: firstRow.electionName,
          description: firstRow.electionDescription,
          start_time: firstRow.start_time,
          end_time: firstRow.end_time,
          options: []
        };

        forEach(results, function(row) {
          console.log('option', row);
          electionData.options.push(
            {
              optionId: row.optionId,
              optionName: row.optionName,
              optionDescription: row.optionDescription,
            }
          );
        });
      }
      cb(electionData);
    });
  });
}

export function addVoterOption(details) {

}

export function submitVote(details) {
  const {
    electionId,
    userName,
    options
  } = details;

  const voterQuery = db.prepare('SELECT id FROM voters WHERE name = (?)');
  voterQuery.get(userName, function(err, user) {
    if (!user) return;
    const sql = `
      INSERT OR REPLACE INTO votes (
        election_id,
        voter_id,
        option_id,
        rank
      ) VALUES (
        (?), (?) ,(?) ,(?)
      )
    `;

    const stmt = db.prepare(sql);
    options.forEach(function(option) {
      if (option.id === null) {
        return;
      }
      stmt.run(electionId, user.id, option.id, option.rank);
    });
    stmt.finalize();
  });
}
