const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "eu-north-1" });

const DOMAIN_CONFIG = {
  "nadamel.pl": {
    to: "biuro@nadamel.pl",
    from: "formularz@nadamel.pl",
    name: "Nadamel",
  },
  "ecopywriting.pl": {
    to: "kontakt@ecopywriting.pl",
    from: "formularz@ecopywriting.pl",
    name: "eCopywriting",
  },
  "by-interior.pl": {
    to: "kontakt@by-interior.pl",
    from: "formularz@by-interior.pl",
    name: "BY Interior",
  },
  "grandkuchnie.pl": {
    to: "kontakt@grandkuchnie.pl",
    from: "formularz@grandkuchnie.pl",
    name: "Grand Kuchnie",
  },
  "karol-leszczynski.pl": {
    to: "kontakt@karol-leszczynski.pl",
    from: "formularz@karol-leszczynski.pl",
    name: "Karol Leszczynski",
  },
  "meble-bydgoszcz.pl": {
    to: "kontakt@meble-bydgoszcz.pl",
    from: "formularz@meble-bydgoszcz.pl",
    name: "Meble Bydgoszcz",
  },
  "project-design.pl": {
    to: "kontakt@project-design.pl",
    from: "formularz@project-design.pl",
    name: "Project Design",
  },
  "torweb.pl": {
    to: "kontakt@torweb.pl",
    from: "formularz@torweb.pl",
    name: "TorWeb",
  },
  "artkuchnie.pl": {
    to: "kontakt@artkuchnie.pl",
    from: "formularz@artkuchnie.pl",
    name: "Art Kuchnie",
  },
  "licencjackie.pl": {
    to: "kontakt@licencjackie.pl",
    from: "formularz@licencjackie.pl",
    name: "Licencjackie.pl",
  },
  "uniatorun.pl": {
    to: "kontakt@uniatorun.pl",
    from: "formularz@uniatorun.pl",
    name: "Akademia Piłkarska Unia Toruń",
  },
};

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, email, phone, subject, message, attachments, domain } = body;

    if (!name || !email || !message || !domain) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Brak wymaganych pol" }),
      };
    }

    const config = DOMAIN_CONFIG[domain];
    if (!config) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nieznana domena: " + domain }),
      };
    }

    const emailSubject = subject
      ? subject + " - " + config.name
      : "Wiadomosc od " + name + " - " + config.name;

    const htmlBody =
      "<h2>" +
      (subject || "Nowa wiadomosc z formularza") +
      " - " +
      config.name +
      "</h2>" +
      "<p><strong>Imie i nazwisko:</strong> " +
      name +
      "</p>" +
      "<p><strong>Email:</strong> " +
      email +
      "</p>" +
      "<p><strong>Telefon:</strong> " +
      (phone || "Nie podano") +
      "</p>" +
      "<p><strong>Wiadomosc:</strong></p>" +
      "<p>" +
      message.replace(/\n/g, "<br>") +
      "</p>" +
      (attachments
        ? "<p><strong>Zalaczniki:</strong><br>" + attachments + "</p>"
        : "");

    const command = new SendEmailCommand({
      Source: config.name + " <" + config.from + ">",
      Destination: { ToAddresses: [config.to] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: emailSubject },
        Body: { Html: { Data: htmlBody } },
      },
    });

    await ses.send(command);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Blad wysylania" }),
    };
  }
};
