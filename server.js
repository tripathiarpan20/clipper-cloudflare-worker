const express = require('express');
const { exec } = require('child_process');

const fs = require('fs');
const path = require('path'); // Import the path module
const app = express();
const port = 3000;

  

// Body parser middleware to handle POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    // User is authenticated, serve the main application page
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle the crawling and conversion
app.post('/convert', async (req, res) => {
    const url = req.body.url;
    const outputFile = 'output.md'; // Temporary output file name

    // Use clipper to convert the URL to Markdown
    exec(`clipper clip -u ${url} -o ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send('Error in conversion');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error in conversion');
        }

        // Read the converted Markdown from the file
        fs.readFile(outputFile, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading output file');
            }

            // Send the Markdown content to the client
            res.send(data);

            // Optionally, delete the temporary file here
        });
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
