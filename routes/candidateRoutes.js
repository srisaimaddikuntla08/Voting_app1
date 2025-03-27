const express = require("express");
const router = express.Router();
const{handleCreateNewCandidate,handleUpdateCandidate,handleDeleteCadidate} =require("../controllers/candidate");
const { generateToken,jwtAuthentication} = require("../jwt");
const Candidate = require("../models/candidate")
const User = require("../models/user")

//UserRoutes
router.post("/signup",[jwtAuthentication],handleCreateNewCandidate)
router.patch("/:candidateID",[jwtAuthentication],handleUpdateCandidate)
router.delete("/:candidateID",[jwtAuthentication],handleDeleteCadidate)



router.post("/vote/:candidateID", [jwtAuthentication], async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        // Find candidate
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(400).json({ message: "Candidate not found" });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User before voting:", user);

        // Check voting eligibility
        if (user.isVoted) {
            return res.status(400).json({ message: "You have already voted" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ message: "Admin is not allowed to vote" });
        }

        // Record the vote
        candidate.votes.push({ user: userId, votedAt: new Date() });
        candidate.votedCount++;  
        user.isVoted = true;  

        await candidate.save();
        await user.save();

        console.log("User after voting:", user);

        return res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Vote Count Route
router.get("/vote/count", async (req, res) => {
    try {
        // Fetch and sort candidates by vote count in descending order
        const candidates = await Candidate.find().sort({ voteCount: -1 });

        // Prepare response
        const voteRecord = candidates.map((data) => ({
            party: data.party,
            count: data.votedCount
        }));

        return res.json(voteRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

    


