import { Grid, Card, CardMedia, CardContent, Typography, Skeleton, Box } from '@mui/material';

const FILE_BASE_URL =  import.meta.env.VITE_FILE_BASE_URL

const SceneCell = ({ scene, imageFile, audioFile }) => {
  const hasImage = !!imageFile?.file_url;
  const hasAudio = !!audioFile?.file_url;

  const imageFileUrl = `${FILE_BASE_URL}${imageFile?.file_url}`;
  const audioFileUrl = `${FILE_BASE_URL}${audioFile?.file_url}`;

  return (
    <Card>
      {hasImage ? (
        <CardMedia
          component="img"
          height={200}
          image={imageFileUrl}
          alt={`Scene ${scene.scene_index}`}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Skeleton variant="rectangular" height={200} />
      )}
      <CardContent sx={{ pb: '8px !important', pt: 1 }}>
        <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
          Scene {scene.scene_index}
        </Typography>
        {hasAudio ? (
          <Box component="audio" controls src={audioFileUrl} sx={{ width: '100%', height: 32 }} />
        ) : (
          <Skeleton variant="rounded" height={32} />
        )}
      </CardContent>
    </Card>
  );
};

const SceneGrid = ({ scenes = [], imageFiles = [], audioFiles = [] }) => {
  if (!scenes.length) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={6} sm={4} key={i}>
            <Skeleton variant="rounded" height={240} />
          </Grid>
        ))}
      </Grid>
    );
  }

  console.log("scenes", scenes);
  console.log("imagesfile", imageFiles)

  return (
    <Grid container spacing={2}>
      {scenes.map((scene, index) => {
        const imageFile = imageFiles.find((f) => f.scene_order === scene.scene_index
);
        const audioFile = audioFiles.find((f) => f.scene_order === scene.scene_index
);
        return (
          <Grid item xs={6} sm={4} key={index}>
            <SceneCell scene={scene} imageFile={imageFile} audioFile={audioFile} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SceneGrid;