"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8000;
const swaggerFile = JSON.parse(fs_1.default.readFileSync('./swagger/output.json').toString());
const db = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'db.json'), 'utf-8'));
app.use((0, cors_1.default)());
app.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerFile));
app.use(express_1.default.json());
app.get('/tasks', (req, res) => {
    // #swagger.description = 'Get all active tasks'
    /* #swagger.responses[200] = {
             description: 'Get all tasks.',
             schema: { $ref: '#/definitions/Tasks' }
     } */
    res.send(db.tasks);
});
app.get('/tasks/:id', (req, res) => {
    /* #swagger.responses[200] = {
             description: 'Get a specific task.',
             schema: { $ref: '#/definitions/Task' }
     } */
    const task = db.tasks.find(task => task.id === Number(req.params.id));
    if (task) {
        res.send(task);
    }
    else {
        res.send(404);
    }
});
app.post('/tasks', (req, res) => {
    /*  #swagger.auto = false
  
              #swagger.path = '/tasks'
              #swagger.method = 'post'
              #swagger.description = 'Endpoint added task.'
              #swagger.produces = ["application/json"]
              #swagger.consumes = ["application/json"]
          */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Data of task.',
            required: true,
            schema: {
                  $body: 'Test task',
                  $deadline: '2024-03-13T16:38',
                  link: 'https://google.com',
                  badges: [
                    {
                      "id": 3,
                      "color": 2,
                      "text": "Пробую сделать"
                    }
                  ]
              }
        }
    */
    console.log(req.body);
    if (req.body.body && req.body.deadline) {
        console.log(req.body);
        const newTask = {
            "id": Math.random(),
            "body": req.body.body,
            "create": Date.now().toString(),
            "remove": "",
            "timeleft": "",
            "deadline": req.body.deadline,
            "link": req.body.link,
            "visible": true,
            "badges": req.body.badges
        };
        db.tasks.push(newTask);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(db.tasks);
    }
    else {
        res.send(400);
    }
});
app.delete('/tasks/:id', (req, res) => {
    const task = db.tasks.find(task => task.id === Number(req.params.id));
    if (task) {
        const index = db.tasks.indexOf(task);
        db.tasks.splice(index, 1);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(db.tasks);
    }
    else {
        res.send(404);
    }
});
app.put('/tasks/:id', (req, res) => {
    const task = db.tasks.find(task => task.id === Number(req.params.id));
    console.log(task);
    console.log(req.body.visible);
    if (task && (req.body.body || req.body.create || req.body.remove || req.body.timeleft || req.body.deadline || req.body.link || "visible" in req.body || req.body.badges)) {
        if (req.body.body) {
            task.body = req.body.body;
        }
        if (req.body.create) {
            task.create = req.body.create;
        }
        if (req.body.remove) {
            task.remove = req.body.remove;
        }
        if (req.body.timeleft) {
            task.timeleft = req.body.timeleft;
        }
        if (req.body.deadline) {
            task.deadline = req.body.deadline;
        }
        if (req.body.link) {
            task.link = req.body.link;
        }
        if ("visible" in req.body) {
            task.visible = req.body.visible;
        }
        if (req.body.badges) {
            let badges = [];
            for (let i in req.body.badges) {
                if (typeof req.body.badges[i] === 'number') {
                    badges.push(req.body.badges[i]);
                }
                else {
                    res.send(404);
                }
            }
            task.badges = badges;
        }
        console.log("МЕНЯЮ");
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(task);
    }
    else {
        res.send(404);
    }
});
app.get('/notes', (req, res) => {
    // #swagger.description = 'Get all active notes'
    /* #swagger.responses[200] = {
             description: 'Get all notes.',
             schema: { $ref: '#/definitions/Notes' }
     } */
    res.send(db.notes);
});
// app.get('/notes/:id', (req, res) => {
//   /* #swagger.responses[200] = {
//            description: 'Get a specific note.',
//            schema: { $ref: '#/definitions/Note' }
//    } */
//   const note = db.notes.find(note => note.uid === Number(req.params.id))
//   if (note) {
//     res.send(note)
//   } else {
//     res.send(404)
//   }
// })
// app.post('/notes', (req, res) => {
//   /*  #swagger.auto = false
//             #swagger.path = '/notes'
//             #swagger.method = 'post'
//             #swagger.description = 'Endpoint added note.'
//             #swagger.produces = ["application/json"]
//             #swagger.consumes = ["application/json"]
//         */
//   /*  #swagger.parameters['body'] = {
//           in: 'body',
//           description: 'Body of note.',
//           required: true,
//           schema: {
//                 $body: '<p>Test body</p>'
//             }
//       }
//   */
//   if (req.body.body) {
//     const newNote: NoteType = {
//       uid: Math.random(),
//       folderUid: 0,
//       label: "New note",
//       body: req.body.body,
//       create: Date.now().toString(),
//       icon: ""
//     }
//     if (req.body.name) {
//       newNote.label = req.body.name
//     }
//     db.notes.push(newNote)
//     fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
//     res.status(200).send(db.notes)
//   } else {
//     res.send(400)
//   }
// })
// app.delete('/notes/:id', (req, res) => {
//   const note = db.notes.find(note => note.uid === Number(req.params.id))
//   if (note) {
//     const index = db.notes.indexOf(note)
//     db.notes.splice(index, 1);
//     fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8')
//     res.status(200).send(db.notes)
//   } else {
//     res.send(404)
//   }
// })
app.put('/notes', (req, res) => {
    db.notes = req.body;
    fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
    res.status(200).send(db.notes);
});
// app.get('/folders', (req, res) => {
//   // #swagger.description = 'Get all active folders.'
//   /* #swagger.responses[200] = {
//            description: 'Get all folders.',
//            schema: { $ref: '#/definitions/Folders' }
//    } */
//   res.send(db.folders)
// })
const removeSlash = (input) => {
    return input.replace(/"/gi, "\"");
};
app.get('/badges', (req, res) => {
    // #swagger.description = 'Get all active badges'
    /* #swagger.responses[200] = {
             description: 'Get all badges.',
             schema: { $ref: '#/definitions/Badges' }
     } */
    res.send(db.badges);
});
app.get('/badges/:id', (req, res) => {
    /* #swagger.responses[200] = {
             description: 'Get a specific badge.',
             schema: { $ref: '#/definitions/Badge' }
     } */
    const badge = db.badges.find(badge => badge.id === Number(req.params.id));
    if (badge) {
        res.send(badge);
    }
    else {
        res.send(404);
    }
});
app.post('/badges', (req, res) => {
    /*  #swagger.auto = false
  
              #swagger.path = '/badges'
              #swagger.method = 'post'
              #swagger.description = 'Endpoint added badge.'
              #swagger.produces = ["application/json"]
              #swagger.consumes = ["application/json"]
          */
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Data of badge.',
            required: true,
            schema: {
              "color": 3,
              "text": "WARNING"
            }
        }
    */
    if (req.body.text && req.body.color) {
        const newBadge = {
            "id": Math.random(),
            "color": req.body.color,
            "text": req.body.text
        };
        db.badges.push(newBadge);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(db.badges);
    }
    else {
        res.send(400);
    }
});
app.delete('/badges/:id', (req, res) => {
    const badge = db.badges.find(badge => badge.id === Number(req.params.id));
    if (badge) {
        const index = db.badges.indexOf(badge);
        db.badges.splice(index, 1);
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(db.badges);
    }
    else {
        res.send(404);
    }
});
app.put('/badges/:id', (req, res) => {
    const badge = db.badges.find(badge => badge.id === Number(req.params.id));
    if (badge && (req.body.color || req.body.text)) {
        if (req.body.color) {
            badge.color = req.body.color;
        }
        if (req.body.text) {
            badge.text = req.body.text;
        }
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, 'db.json'), JSON.stringify(db), 'utf-8');
        res.status(200).send(badge);
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
