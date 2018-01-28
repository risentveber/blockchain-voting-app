document.addEventListener('DOMContentLoaded', () => {
  fetch('/state')
    .then(res => res.json())
    .then(res => {
      console.log(res);
      document.querySelector('#candidatesTable').innerHTML = res.candidates.map((candidate) => `
        <tr>
          <td>${candidate.name}</td>
          <td id='${candidate.name}'>${candidate.votes}</td>
        </tr>`).join('\n');
      document.querySelector('#selectCandidate').innerHTML = res.candidates.map((candidate) => `
        <option value=${candidate.name}>${candidate.name}</option>
        `).join('\n');
      document.querySelector('#selectAccount').innerHTML = res.accounts.map((acc) => `
        <option value=${acc}>${acc}</option>
        `).join('\n');
    }).catch(console.error);

  document.querySelector('#voteSubmit').addEventListener('click', () => {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    fetch('/vote', {
      method: 'post',
      headers,
      body: JSON.stringify({
        candidateName: document.querySelector('#selectCandidate').value,
        sender: document.querySelector('#selectAccount').value
      }),
    })
      .then(res => res.json())
      .then(res => {
        document.querySelector(`#${res.name}`).innerHTML = res.votes;
      }).catch(console.error);
  });
});

