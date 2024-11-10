<script lang="ts">
  // Profile data interfaces
  interface Badge {
    icon: string;
    name: string;
    bgColor: string;
  }

  interface ConnectedPlatform {
    name: string;
    icon: string;
    isConnected: boolean;
  }

  interface LearningProgress {
    subject: string;
    percentage: number;
  }

  interface Activity {
    title: string;
    timeAgo: string;
  }

  // Mock data - this would typically come from props or stores
  const badges: Badge[] = [
    { icon: "🏆", name: "Math Master", bgColor: "bg-yellow-100" },
    { icon: "⭐", name: "Top Helper", bgColor: "bg-blue-100" },
    { icon: "🎯", name: "Goal Setter", bgColor: "bg-green-100" }
  ];

  const platforms: ConnectedPlatform[] = [
    { name: "GitHub", icon: "github-icon.svg", isConnected: true },
    { name: "LinkedIn", icon: "linkedin-icon.svg", isConnected: true },
    { name: "Kaggle", icon: "kaggle-icon.svg", isConnected: false }
  ];

  const progress: LearningProgress[] = [
    { subject: "Mathematics", percentage: 75 },
    { subject: "Computer Science", percentage: 60 },
    { subject: "Physics", percentage: 45 }
  ];

  const recentActivity: Activity[] = [
    { title: "Completed Advanced Calculus Module", timeAgo: "2 days ago" },
    { title: "Answered 5 questions in Computer Science forum", timeAgo: "3 days ago" },
    { title: "Earned \"Math Master\" badge", timeAgo: "1 week ago" }
  ];

  function handleEditProfile() {
    // Handle edit profile click
  }
</script>

<div class="container mx-auto px-4 py-8">
    <!-- Profile Header -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row items-center">
            <div class="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0">
                <img src="profile-avatar.jpg" alt="Profile Picture" class="w-full h-full object-cover">
            </div>
            <div class="md:ml-6 text-center md:text-left">
                <h1 class="text-2xl font-bold">Jane Doe</h1>
                <p class="text-gray-600">@janedoe</p>
                <div class="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Mathematics</span>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Computer Science</span>
                    <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Physics</span>
                </div>
            </div>
            <div class="ml-auto mt-4 md:mt-0">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg" on:click={handleEditProfile}>Edit Profile</button>
            </div>
        </div>
    </div>

    <!-- Stats & Achievements -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Learning Stats</h2>
            <div class="space-y-4">
                <div>
                    <p class="text-gray-600">Domains Mastered</p>
                    <p class="text-2xl font-bold">3/7</p>
                </div>
                <div>
                    <p class="text-gray-600">Topics Completed</p>
                    <p class="text-2xl font-bold">24</p>
                </div>
                <div>
                    <p class="text-gray-600">Contribution Points</p>
                    <p class="text-2xl font-bold">1,250</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Badges</h2>
            <div class="grid grid-cols-3 gap-4">
                {#each badges as badge}
                    <div class="text-center">
                        <div class="w-12 h-12 mx-auto mb-2 {badge.bgColor} rounded-full flex items-center justify-center">
                            <span class="text-2xl">{badge.icon}</span>
                        </div>
                        <p class="text-sm">{badge.name}</p>
                    </div>
                {/each}
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Connected Platforms</h2>
            <div class="space-y-4">
                {#each platforms as platform}
                    <div class="flex items-center">
                        <img src={platform.icon} alt={platform.name} class="w-6 h-6 mr-3">
                        <span>{platform.name}</span>
                        <span class="ml-auto text-{platform.isConnected ? 'green' : 'gray'}-600">
                            {platform.isConnected ? 'Connected' : 'Connect'}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Learning Progress -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Learning Progress</h2>
        <div class="space-y-6">
            {#each progress as item}
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="font-medium">{item.subject}</span>
                        <span>{item.percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: {item.percentage}%"></div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <div class="space-y-4">
            {#each recentActivity as activity}
                <div class="flex items-start">
                    <div class="w-2 h-2 mt-2 rounded-full bg-blue-600 mr-4"></div>
                    <div>
                        <p class="font-medium">{activity.title}</p>
                        <p class="text-sm text-gray-600">{activity.timeAgo}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>