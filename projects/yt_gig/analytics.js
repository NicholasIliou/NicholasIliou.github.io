var apiKey = 'AIzaSyBKDWCSVeXSHJf7qxYAOfBdr9PSk7YV5Hw'; // YouTube Data API v3 key
var videos = [
    '42DOvL9lTbo',
    '9f5ZX7N9By0',
    'C16NYVMdNKM',
    'L6Bns0spfLg',
    'yqVQ9S_qyLk',
    'JqQyoeOSS00',
    'eKbd5mnzKt4',
    'vbmaOmddsXE',
    'B7WPYgYM6fE',
    'ZFEhfcpy-I0',
    'V83lP1XJU0Q',
    '4rOw3RuCuro',
    'F5MPxKyvQTA',
    '59jTOxQ0WNc',
    'DprU_1RR2DE',
    'ayt58Qr_R-8',
    'mnkaPSlqrwY',
    'w02mEqgrCNU',
    'RaXp3laTzZ8',
    'ck2uapO-jHY',
    'BY7z6IfBEuQ',
    'ROM4SHEthm4',
    'rWY_Jg2Lgns',
    'ijUxJwJDoHw',
    'e2k-UBs7l1Q',
    '6XgVro7UFfQ',
    'QIUyqi2B94k',
    'JCKOIPVu2iY',
    'C9_mHy5PMWw',
    'HHvL8hbny-Y',
    'CSv_ly4c-Y4',
    'R7QsCZy2f5M',
    '9Xsi4_3SxzU',
    'XB5ud7_pBQw',
    'bneMu-c4iZY',
    'UkSGuTv6PKY',
    'h6VUXn9-tGQ',
    'pSwZR8_CxYs',
    'iRXsXVSf-cs',
    'v7Jdi5gRC9c',
]

document.addEventListener("DOMContentLoaded", function () {
    const statsContainer = document.getElementById("statsContainer");

    if (!statsContainer) {
        console.error("Error: Element with ID 'statsContainer' not found.");
        return;
    }

    const config = {
        labels: {
            totalViews: "Total Views",
            totalWatchTime: "Total Watch Time (minutes)",
            totalLikes: "Total Likes",
            totalComments: "Total Comments",
            avgViewDuration: "Avg. View Duration (minutes)",
            engagementRate: "Engagement Rate (%)",
            videoCount: "Total Videos"
        },
        showStats: ["totalViews", "totalLikes", "engagementRate", "videoCount"] // Customizable list
    };

    async function getYouTubeStats() {
        const part = 'statistics,snippet,contentDetails';
        const batchSize = 50;
        let stats = {
            totalViews: 0,
            totalWatchTime: 0, // Requires advanced API
            totalLikes: 0,
            totalComments: 0,
            videoCount: videos.length
        };

        let batches = [];
        for (let i = 0; i < videos.length; i += batchSize) {
            batches.push(videos.slice(i, i + batchSize));
        }

        for (const batch of batches) {
            let url = `https://www.googleapis.com/youtube/v3/videos?part=${part}&id=${batch.join(',')}&key=${apiKey}`;
            try {
                let response = await fetch(url);
                let data = await response.json();

                data.items.forEach(video => {
                    let videoStats = video.statistics || {};
                    stats.totalViews += parseInt(videoStats.viewCount || 0);
                    stats.totalWatchTime += parseInt(videoStats.watchTimeMinutes || 0);
                    stats.totalLikes += parseInt(videoStats.likeCount || 0);
                    stats.totalComments += parseInt(videoStats.commentCount || 0);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        stats.avgViewDuration = stats.totalViews ? (stats.totalWatchTime / stats.totalViews).toFixed(2) : 0;
        stats.engagementRate = stats.totalViews ? (((stats.totalLikes + stats.totalComments) / stats.totalViews) * 100).toFixed(2) : 0;

        displayStats(stats);
    }

    function displayStats(stats) {
        statsContainer.innerHTML = '';

        let ul = document.createElement('ul');

        config.showStats.forEach(statKey => {
            if (stats[statKey] !== undefined && stats[statKey] > 0) {
                let li = document.createElement('li');
                li.textContent = `${config.labels[statKey] || statKey}: ${formatNumber(stats[statKey])}`;
                ul.appendChild(li);
            }
        });

        if (ul.children.length === 0) {
            statsContainer.innerHTML = '<p>No valid data available.</p>';
        } else {
            statsContainer.appendChild(ul);
        }
    }

    function formatNumber(num) {
        return num.toLocaleString();
    }

    getYouTubeStats();
});