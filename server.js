const express = require('express');
const contractInstance = require('./deployContract.js');
const web3 = require('./web3Client.js');

const app = express();
const bodyParser = require('body-parser');
const candidates = require('./candidates.js');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/vote', (req, res) => {
  const candidateName = req.body.candidateName.trim();
  const sender = req.body.sender.trim();
  console.log('Vote for', candidateName, sender);

  contractInstance.voteForCandidate(candidateName, { from: sender }, () => {
    const totalVotes = contractInstance.totalVotesFor.call(
      candidateName,
      { from: sender }
    ).toString();

    res.json({ votes: totalVotes, name: candidateName });
  });
});

app.get('/state', (req, res) => {
  const candidateVotes = candidates.map((candidate) => {
    const votes = contractInstance.totalVotesFor.call(
      candidate,
      { from: web3.eth.accounts[0] }
    ).toString();

    return {
      name: candidate,
      votes,
    };
  });

  res.json({ candidates: candidateVotes, accounts: web3.eth.accounts });
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send(`Failed! ${err}`);
  } else {
    next();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App ready and listening on port ${port}!`);
});
