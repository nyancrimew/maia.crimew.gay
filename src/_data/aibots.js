module.exports = async function() {
    response = await fetch("https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt");
    return response.text()
}