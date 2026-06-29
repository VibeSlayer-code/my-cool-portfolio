export type Track = {
  title: string;
  artist: string;
  url: string;
  embedId: string;
};

export const tracks: Track[] = [
  {
    title: "Empty Your Pockets",
    artist: "Juice WRLD",
    url: "https://www.youtube.com/watch?v=bmkJ6ZkLgiA&list=RDbmkJ6ZkLgiA&start_radio=1",
    embedId: "bmkJ6ZkLgiA",
  },
  {
    title: "denial",
    artist: "DREAMTHUG, Weeler",
    url: "https://youtu.be/DpSx9hrq2Bs?si=CY5P1K8ChHbM5HSX",
    embedId: "DpSx9hrq2Bs",
  },
  {
    title: "Summr Girl",
    artist: "Summrs International, fallnluv",
    url: "https://youtu.be/DrSQ7JH_5JQ?si=EvoPUCBuPgtWedZZ",
    embedId: "DrSQ7JH_5JQ",
  },
  {
    title: "#HurtingHeart",
    artist: "Yung Frendi",
    url: "https://www.youtube.com/watch?v=BUGaDr0Dcps&list=RDBUGaDr0Dcps&start_radio=1",
    embedId: "BUGaDr0Dcps",
  },
  {
    title: "With My Hoe!",
    artist: "C2d",
    url: "https://www.youtube.com/watch?v=TycUylvnJ1o&list=RDTycUylvnJ1o&start_radio=1",
    embedId: "TycUylvnJ1o",
  },
  {
    title: "God Like",
    artist: "Summrs",
    url: "https://www.youtube.com/watch?v=ET2xm9ys0_o&list=RDET2xm9ys0_o&start_radio=1",
    embedId: "ET2xm9ys0_o",
  },
  {
    title: "Make U Mine",
    artist: "Yung Frendi, Jaydes",
    url: "https://www.youtube.com/watch?v=BfMq7zJrtjI",
    embedId: "BfMq7zJrtjI",
  },
];

export const thumbnailFor = (track: Track) =>
  `https://img.youtube.com/vi/${track.embedId}/mqdefault.jpg`;
