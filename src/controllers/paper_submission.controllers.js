import PaperSubmission from "../schema/paper_submission.schema.js";
import { mail } from "../utils/smtp.js";
import paper_sobmission_lead from "../utils/emailTemplate/paper_sobmission.js";
import paper_sobmission_replay from "../utils/emailTemplate/paper_submisstion_replay.js";

export const paper_submission_GetAll = async (req, res) => {
  try {
    const paperSubmissions = await PaperSubmission.find();
    res.status(200).json({
      message: "Get all paper submissions successfully",
      data: paperSubmissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching paper submissions" });
  }
};

export const paper_submission_GetById = async (req, res) => {
  try {
    const id = req.params.id;
    const paperSubmission = await PaperSubmission.findById(id);
    if (!paperSubmission) {
      return res.status(404).json({ message: "Paper submission not found" });
    }
    res.status(200).json({
      message: "Get paper submission by id successfully",
      data: paperSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching paper submission" });
  }
};

export const paper_submission_Create = async (req, res) => {
  try {
    const paperSubmission = new PaperSubmission({
      ...req.body,
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer,
      },
    });
    const data = await paperSubmission.save();

    const attachment = [
      {
        filename: data.file.originalname,
        content: data.file.buffer,
        contentType: data.file.mimetype,
      },
    ];
    mail(
      "New Paper Submission from WCMRP 2026",
      paper_sobmission_lead(data),
      attachment,
    );
    // replay mail
    mail(
      "New Paper Submission from WCMRP 2026",
      paper_sobmission_replay(data),
      null,
      data.correspondingEmail,
    );
    res.status(201).json({ message: "Paper Submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating paper submission" });
  }
};

const sendEmailToAdmin = async (subject, htmlContent, attachment) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, secure: false,
      auth: { user: process.env.ADMIN_MAIL, pass: process.env.ADMIN_PASS },
    });
    await transporter.sendMail({ from: process.env.ADMIN_MAIL, to: process.env.ADMIN_MAIL, subject, html: htmlContent, attachments: attachment });
    console.log("Email sent to admin:", process.env.ADMIN_MAIL);
  } catch (error) { console.error("Error sending email to admin:", error); }
};

const sendEmailToUser = async (subject, htmlContent, Email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, secure: false,
      auth: { user: process.env.ADMIN_MAIL, pass: process.env.ADMIN_PASS },
    });
    await transporter.sendMail({ from: process.env.ADMIN_MAIL, to: Email, subject, html: htmlContent });
    console.log("Email sent to User:", Email);
  } catch (error) { console.error("Error sending email to User:", error); }
};